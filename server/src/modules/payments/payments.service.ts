import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WithdrawalDto, AddFundsDto, AddPaymentMethodDto } from './dto/payment.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(private prisma: PrismaService) {}

  async getBalance(userId: string) {
    const [earnings, withdrawals, deposits, pending] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: { userId, type: 'payment', status: 'completed' },
        _sum: { net: true },
      }),
      this.prisma.transaction.aggregate({
        where: { userId, type: 'withdrawal', status: 'completed' },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { userId, type: 'deposit', status: 'completed' },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { userId, type: 'payment', status: 'pending' },
        _sum: { net: true },
      }),
    ]);

    const totalEarnings = earnings._sum.net ?? new Decimal(0);
    const totalWithdrawn = withdrawals._sum.amount ?? new Decimal(0);
    const totalDeposits = deposits._sum.amount ?? new Decimal(0);
    const available = new Decimal(totalEarnings.toString())
      .minus(totalWithdrawn.toString())
      .plus(totalDeposits.toString());

    return {
      available: available.toNumber(),
      pending: (pending._sum.net ?? new Decimal(0)).toNumber(),
      totalEarnings: totalEarnings.toNumber(),
      totalWithdrawn: totalWithdrawn.toNumber(),
    };
  }

  async getEarnings(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId, type: 'payment' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTransactions(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async requestWithdrawal(userId: string, dto: WithdrawalDto) {
    return this.prisma.$transaction(async (tx) => {
      const [earnings, withdrawals, deposits] = await Promise.all([
        tx.transaction.aggregate({
          where: { userId, type: 'payment', status: 'completed' },
          _sum: { net: true },
        }),
        tx.transaction.aggregate({
          where: { userId, type: 'withdrawal', status: 'completed' },
          _sum: { amount: true },
        }),
        tx.transaction.aggregate({
          where: { userId, type: 'deposit', status: 'completed' },
          _sum: { amount: true },
        }),
      ]);

      const totalEarnings = earnings._sum.net ?? new Decimal(0);
      const totalWithdrawn = withdrawals._sum.amount ?? new Decimal(0);
      const totalDeposits = deposits._sum.amount ?? new Decimal(0);
      const available = new Decimal(totalEarnings.toString())
        .minus(totalWithdrawn.toString())
        .plus(totalDeposits.toString());

      if (available.lessThan(dto.amount)) {
        throw new BadRequestException('Insufficient balance');
      }

      const pm = await tx.paymentMethod.findFirst({
        where: { id: dto.paymentMethodId, userId },
      });
      if (!pm) throw new NotFoundException('Payment method not found');

      return tx.transaction.create({
        data: {
          userId,
          type: 'withdrawal',
          amount: dto.amount,
          net: dto.amount,
          status: 'pending',
          description: `Withdrawal to ${pm.label}`,
          reference: dto.paymentMethodId,
        },
      });
    });
  }

  async getWithdrawals(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId, type: 'withdrawal' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPaymentMethods(userId: string) {
    return this.prisma.paymentMethod.findMany({ where: { userId } });
  }

  async addPaymentMethod(userId: string, dto: AddPaymentMethodDto) {
    return this.prisma.paymentMethod.create({
      data: {
        userId,
        type: dto.type as any,
        label: dto.label,
        last4: dto.last4,
        brand: dto.brand,
      },
    });
  }

  async removePaymentMethod(userId: string, id: string) {
    const pm = await this.prisma.paymentMethod.findFirst({ where: { id, userId } });
    if (!pm) throw new NotFoundException();
    await this.prisma.paymentMethod.delete({ where: { id } });
  }

  async setDefaultPaymentMethod(userId: string, id: string) {
    await this.prisma.$transaction([
      this.prisma.paymentMethod.updateMany({ where: { userId }, data: { isDefault: false } }),
      this.prisma.paymentMethod.update({ where: { id }, data: { isDefault: true } }),
    ]);
  }

  async addFunds(userId: string, dto: AddFundsDto) {
    return this.prisma.transaction.create({
      data: {
        userId,
        type: 'deposit',
        amount: dto.amount,
        net: dto.amount,
        status: 'completed',
        description: 'Deposit',
        reference: dto.paymentMethodId,
      },
    });
  }

  async getConnectsBalance(userId: string) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [profile, usedAgg, applicationsThisMonth, recentPurchases] = await Promise.all([
      this.prisma.freelancerProfile.findUnique({ where: { userId } }),
      this.prisma.proposal.aggregate({
        where: { freelancerId: userId, createdAt: { gte: startOfMonth } },
        _sum: { connectsUsed: true },
      }),
      this.prisma.proposal.count({
        where: { freelancerId: userId, createdAt: { gte: startOfMonth } },
      }),
      this.prisma.transaction.findMany({
        where: { userId, type: 'connects_purchase', status: 'completed' },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, description: true, createdAt: true },
      }),
    ]);

    return {
      balance: profile?.connectsBalance ?? 0,
      usedThisMonth: usedAgg._sum.connectsUsed ?? 0,
      applicationsThisMonth,
      recentPurchases: recentPurchases.map((r) => ({
        id: r.id,
        description: r.description ?? 'Connects purchase',
        createdAt: r.createdAt.toISOString(),
      })),
    };
  }

  async buyConnects(userId: string, packageId: string) {
    return this.prisma.$transaction(async (tx) => {
      const pkg = await tx.connectsPackage.findUnique({ where: { id: packageId } });
      if (!pkg) throw new NotFoundException('Package not found');

      await tx.freelancerProfile.update({
        where: { userId },
        data: { connectsBalance: { increment: pkg.connects } },
      });

      await tx.transaction.create({
        data: {
          userId,
          type: 'connects_purchase',
          amount: pkg.price,
          net: pkg.price,
          status: 'completed',
          description: `Purchased ${pkg.connects} connects`,
        },
      });

      const updated = await tx.freelancerProfile.findUnique({ where: { userId } });
      return { balance: updated?.connectsBalance ?? 0 };
    });
  }

  async getConnectsPackages() {
    return this.prisma.connectsPackage.findMany();
  }

  async downloadInvoice(_userId: string, _transactionId: string) {
    return Buffer.from('Invoice PDF placeholder');
  }
}

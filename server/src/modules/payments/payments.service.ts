import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WithdrawalDto, AddFundsDto, AddPaymentMethodDto } from './dto/payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async getBalance(userId: string) {
    const earnings = await this.prisma.transaction.aggregate({
      where: { userId, type: 'payment', status: 'completed' },
      _sum: { net: true },
    });
    const withdrawals = await this.prisma.transaction.aggregate({
      where: { userId, type: 'withdrawal', status: 'completed' },
      _sum: { amount: true },
    });
    const deposits = await this.prisma.transaction.aggregate({
      where: { userId, type: 'deposit', status: 'completed' },
      _sum: { amount: true },
    });

    const available = (earnings._sum.net ?? 0) - (withdrawals._sum.amount ?? 0) + (deposits._sum.amount ?? 0);
    const pending = await this.prisma.transaction.aggregate({
      where: { userId, type: 'payment', status: 'pending' },
      _sum: { net: true },
    });

    return {
      available,
      pending: pending._sum.net ?? 0,
      totalEarnings: earnings._sum.net ?? 0,
      totalWithdrawn: withdrawals._sum.amount ?? 0,
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
    const balance = await this.getBalance(userId);
    if (dto.amount > balance.available) throw new BadRequestException('Insufficient balance');

    return this.prisma.transaction.create({
      data: {
        userId,
        type: 'withdrawal',
        amount: dto.amount,
        net: dto.amount,
        status: 'completed',
        description: 'Withdrawal',
        reference: dto.paymentMethodId,
      },
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
      data: { userId, type: dto.type, label: dto.label, last4: dto.last4, brand: dto.brand },
    });
  }

  async removePaymentMethod(userId: string, id: string) {
    const pm = await this.prisma.paymentMethod.findFirst({ where: { id, userId } });
    if (!pm) throw new NotFoundException();
    await this.prisma.paymentMethod.delete({ where: { id } });
  }

  async setDefaultPaymentMethod(userId: string, id: string) {
    await this.prisma.paymentMethod.updateMany({ where: { userId }, data: { isDefault: false } });
    await this.prisma.paymentMethod.update({ where: { id }, data: { isDefault: true } });
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
    const profile = await this.prisma.freelancerProfile.findUnique({ where: { userId } });
    return { balance: profile?.connectsBalance ?? 0, history: [] };
  }

  async buyConnects(userId: string, packageId: string) {
    const pkg = await this.prisma.connectsPackage.findUnique({ where: { id: packageId } });
    if (!pkg) throw new NotFoundException('Package not found');

    await this.prisma.freelancerProfile.update({
      where: { userId },
      data: { connectsBalance: { increment: pkg.connects } },
    });

    await this.prisma.transaction.create({
      data: {
        userId,
        type: 'connects_purchase',
        amount: pkg.price,
        net: pkg.price,
        status: 'completed',
        description: `Purchased ${pkg.connects} connects`,
      },
    });

    const updated = await this.prisma.freelancerProfile.findUnique({ where: { userId } });
    return { balance: updated?.connectsBalance ?? 0 };
  }

  async getConnectsPackages() {
    return this.prisma.connectsPackage.findMany();
  }

  async downloadInvoice(_userId: string, _transactionId: string) {
    return Buffer.from('Invoice PDF placeholder');
  }
}

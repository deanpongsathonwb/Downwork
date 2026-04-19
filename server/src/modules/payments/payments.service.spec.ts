import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../../prisma/prisma.service';

const dec = (n: number) => new Decimal(n);

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prisma: Record<string, any>;

  beforeEach(async () => {
    prisma = {
      transaction: {
        aggregate: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
      },
      paymentMethod: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        delete: jest.fn(),
      },
      freelancerProfile: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      connectsPackage: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  // ── getBalance ────────────────────────────────────────────

  describe('getBalance', () => {
    it('should return correct balance calculations', async () => {
      prisma.transaction.aggregate
        .mockResolvedValueOnce({ _sum: { net: dec(1000) } })     // earnings
        .mockResolvedValueOnce({ _sum: { amount: dec(200) } })   // withdrawals
        .mockResolvedValueOnce({ _sum: { amount: dec(500) } })   // deposits
        .mockResolvedValueOnce({ _sum: { net: dec(150) } });     // pending

      const result = await service.getBalance('user-1');

      expect(result.available).toBe(1300);    // 1000 - 200 + 500
      expect(result.pending).toBe(150);
      expect(result.totalEarnings).toBe(1000);
      expect(result.totalWithdrawn).toBe(200);
    });

    it('should default null aggregates to zero', async () => {
      prisma.transaction.aggregate
        .mockResolvedValueOnce({ _sum: { net: null } })
        .mockResolvedValueOnce({ _sum: { amount: null } })
        .mockResolvedValueOnce({ _sum: { amount: null } })
        .mockResolvedValueOnce({ _sum: { net: null } });

      const result = await service.getBalance('user-1');

      expect(result.available).toBe(0);
      expect(result.pending).toBe(0);
      expect(result.totalEarnings).toBe(0);
      expect(result.totalWithdrawn).toBe(0);
    });

    it('should query with correct transaction type/status filters', async () => {
      prisma.transaction.aggregate.mockResolvedValue({ _sum: { net: null, amount: null } });

      await service.getBalance('user-1');

      expect(prisma.transaction.aggregate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1', type: 'payment', status: 'completed' },
        }),
      );
      expect(prisma.transaction.aggregate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1', type: 'withdrawal', status: 'completed' },
        }),
      );
      expect(prisma.transaction.aggregate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1', type: 'deposit', status: 'completed' },
        }),
      );
      expect(prisma.transaction.aggregate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1', type: 'payment', status: 'pending' },
        }),
      );
    });
  });

  // ── requestWithdrawal ─────────────────────────────────────

  describe('requestWithdrawal', () => {
    const dto = { amount: 100, paymentMethodId: 'pm-1' };

    it('should create a withdrawal transaction within a Prisma transaction', async () => {
      const txMock = {
        transaction: {
          aggregate: jest.fn(),
          create: jest.fn().mockResolvedValue({ id: 'tx-1', amount: 100, status: 'pending' }),
        },
        paymentMethod: {
          findFirst: jest.fn().mockResolvedValue({ id: 'pm-1', label: 'My Bank', userId: 'user-1' }),
        },
      };

      txMock.transaction.aggregate
        .mockResolvedValueOnce({ _sum: { net: dec(500) } })
        .mockResolvedValueOnce({ _sum: { amount: dec(100) } })
        .mockResolvedValueOnce({ _sum: { amount: dec(0) } });

      prisma.$transaction.mockImplementation((cb: (tx: typeof txMock) => Promise<unknown>) =>
        cb(txMock),
      );

      const result = await service.requestWithdrawal('user-1', dto);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(txMock.transaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user-1',
            type: 'withdrawal',
            amount: dto.amount,
            status: 'pending',
          }),
        }),
      );
      expect(result).toEqual(expect.objectContaining({ id: 'tx-1' }));
    });

    it('should reject withdrawal when balance is insufficient', async () => {
      const txMock = {
        transaction: { aggregate: jest.fn() },
        paymentMethod: { findFirst: jest.fn() },
      };

      txMock.transaction.aggregate
        .mockResolvedValueOnce({ _sum: { net: dec(50) } })
        .mockResolvedValueOnce({ _sum: { amount: dec(0) } })
        .mockResolvedValueOnce({ _sum: { amount: dec(0) } });

      prisma.$transaction.mockImplementation((cb: (tx: typeof txMock) => Promise<unknown>) =>
        cb(txMock),
      );

      await expect(service.requestWithdrawal('user-1', dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when payment method is not found', async () => {
      const txMock = {
        transaction: { aggregate: jest.fn() },
        paymentMethod: { findFirst: jest.fn().mockResolvedValue(null) },
      };

      txMock.transaction.aggregate
        .mockResolvedValueOnce({ _sum: { net: dec(5000) } })
        .mockResolvedValueOnce({ _sum: { amount: dec(0) } })
        .mockResolvedValueOnce({ _sum: { amount: dec(0) } });

      prisma.$transaction.mockImplementation((cb: (tx: typeof txMock) => Promise<unknown>) =>
        cb(txMock),
      );

      await expect(service.requestWithdrawal('user-1', dto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ── setDefaultPaymentMethod ───────────────────────────────

  describe('setDefaultPaymentMethod', () => {
    it('should use a Prisma batch transaction', async () => {
      prisma.$transaction.mockResolvedValue([{}, {}]);

      await service.setDefaultPaymentMethod('user-1', 'pm-2');

      expect(prisma.$transaction).toHaveBeenCalled();
      const txArg = prisma.$transaction.mock.calls[0][0];
      expect(Array.isArray(txArg)).toBe(true);
      expect(txArg).toHaveLength(2);
    });

    it('should unset all defaults before setting the new one', async () => {
      prisma.paymentMethod.updateMany.mockResolvedValue({ count: 2 });
      prisma.paymentMethod.update.mockResolvedValue({});
      prisma.$transaction.mockResolvedValue([{ count: 2 }, {}]);

      await service.setDefaultPaymentMethod('user-1', 'pm-2');

      expect(prisma.paymentMethod.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1' },
          data: { isDefault: false },
        }),
      );
      expect(prisma.paymentMethod.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'pm-2' },
          data: { isDefault: true },
        }),
      );
    });
  });

  // ── buyConnects ───────────────────────────────────────────

  describe('buyConnects', () => {
    it('should purchase connects and return updated balance', async () => {
      const pkg = { id: 'pkg-1', name: '20 Connects', connects: 20, price: dec(5) };
      const txMock = {
        connectsPackage: {
          findUnique: jest.fn().mockResolvedValue(pkg),
        },
        freelancerProfile: {
          update: jest.fn().mockResolvedValue({}),
          findUnique: jest.fn().mockResolvedValue({ connectsBalance: 80 }),
        },
        transaction: {
          create: jest.fn().mockResolvedValue({}),
        },
      };

      prisma.$transaction.mockImplementation((cb: (tx: typeof txMock) => Promise<unknown>) =>
        cb(txMock),
      );

      const result = await service.buyConnects('user-1', 'pkg-1');

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(txMock.connectsPackage.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'pkg-1' } }),
      );
      expect(txMock.freelancerProfile.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1' },
          data: { connectsBalance: { increment: 20 } },
        }),
      );
      expect(result.balance).toBe(80);
    });

    it('should throw NotFoundException when package does not exist', async () => {
      const txMock = {
        connectsPackage: { findUnique: jest.fn().mockResolvedValue(null) },
        freelancerProfile: { update: jest.fn(), findUnique: jest.fn() },
        transaction: { create: jest.fn() },
      };

      prisma.$transaction.mockImplementation((cb: (tx: typeof txMock) => Promise<unknown>) =>
        cb(txMock),
      );

      await expect(service.buyConnects('user-1', 'invalid')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should record a connects_purchase transaction', async () => {
      const pkg = { id: 'pkg-1', name: '20 Connects', connects: 20, price: dec(5) };
      const txMock = {
        connectsPackage: { findUnique: jest.fn().mockResolvedValue(pkg) },
        freelancerProfile: {
          update: jest.fn().mockResolvedValue({}),
          findUnique: jest.fn().mockResolvedValue({ connectsBalance: 80 }),
        },
        transaction: { create: jest.fn().mockResolvedValue({}) },
      };

      prisma.$transaction.mockImplementation((cb: (tx: typeof txMock) => Promise<unknown>) =>
        cb(txMock),
      );

      await service.buyConnects('user-1', 'pkg-1');

      expect(txMock.transaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user-1',
            type: 'connects_purchase',
            status: 'completed',
          }),
        }),
      );
    });
  });
});

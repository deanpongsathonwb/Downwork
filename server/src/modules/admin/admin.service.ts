import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [totalUsers, totalFreelancers, totalClients, totalJobs, totalContracts, activeContracts, openDisputes] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({ where: { role: 'freelancer' } }),
        this.prisma.user.count({ where: { role: 'client' } }),
        this.prisma.job.count(),
        this.prisma.contract.count(),
        this.prisma.contract.count({ where: { status: 'active' } }),
        this.prisma.dispute.count({ where: { status: 'open' } }),
      ]);

    const revenue = await this.prisma.transaction.aggregate({
      where: { type: 'fee' },
      _sum: { amount: true },
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newUsersThisMonth = await this.prisma.user.count({
      where: { createdAt: { gte: startOfMonth } },
    });

    return {
      totalUsers,
      totalFreelancers,
      totalClients,
      totalJobs,
      totalContracts,
      totalRevenue: revenue._sum.amount ?? 0,
      activeContracts,
      openDisputes,
      newUsersThisMonth,
      revenueThisMonth: 0,
      platformFeeRate: 20,
    };
  }

  async getUsers(params?: Record<string, unknown>) {
    const where: Record<string, unknown> = {};
    if (params?.role) where.role = params.role;
    if (params?.status) where.status = params.status;

    const users = await this.prisma.user.findMany({
      where,
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, status: true, avatar: true, createdAt: true,
        isEmailVerified: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return users;
  }

  async getUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { freelancerProfile: true, clientProfile: true },
    });
    if (!user) throw new NotFoundException('User not found');
    const { password, twoFactorSecret, ...safe } = user;
    return safe;
  }

  async banUser(userId: string, reason: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { status: 'banned', banReason: reason },
    });
  }

  async unbanUser(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { status: 'active', banReason: null },
    });
  }

  async suspendUser(userId: string, days: number, reason: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        status: 'suspended',
        suspendedUntil: new Date(Date.now() + days * 86400000),
        banReason: reason,
      },
    });
  }

  async deleteUser(userId: string) {
    await this.prisma.user.delete({ where: { id: userId } });
  }

  async getPendingJobs() {
    return this.prisma.job.findMany({
      where: { status: 'draft' },
      include: { client: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approveJob(jobId: string) {
    await this.prisma.job.update({ where: { id: jobId }, data: { status: 'open' } });
  }

  async rejectJob(jobId: string, _reason: string) {
    await this.prisma.job.update({ where: { id: jobId }, data: { status: 'closed' } });
  }

  async getDisputes(status?: string) {
    const where: Prisma.DisputeWhereInput = status ? { status: status as any } : {};
    return this.prisma.dispute.findMany({
      where,
      include: {
        contract: { select: { id: true, title: true } },
        initiator: { select: { id: true, firstName: true, lastName: true } },
        respondent: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDispute(disputeId: string) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
      include: {
        contract: true,
        initiator: { select: { id: true, firstName: true, lastName: true, email: true } },
        respondent: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
    if (!dispute) throw new NotFoundException('Dispute not found');
    return dispute;
  }

  async resolveDispute(disputeId: string, resolution: string, favorOf: string) {
    await this.prisma.dispute.update({
      where: { id: disputeId },
      data: { status: 'resolved', resolution, resolvedAt: new Date() },
    });
  }

  async getKYCSubmissions(status?: string) {
    const where: Prisma.KYCDocumentWhereInput = status ? { status: status as any } : {};
    return this.prisma.kYCDocument.findMany({
      where,
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async approveKYC(documentId: string) {
    await this.prisma.kYCDocument.update({
      where: { id: documentId },
      data: { status: 'approved', reviewedAt: new Date() },
    });
  }

  async rejectKYC(documentId: string, reason: string) {
    await this.prisma.kYCDocument.update({
      where: { id: documentId },
      data: { status: 'rejected', rejectionReason: reason, reviewedAt: new Date() },
    });
  }

  async getReports(status?: string) {
    const where: Prisma.ReportWhereInput = status ? { status: status as any } : {};
    return this.prisma.report.findMany({
      where,
      include: {
        reporter: { select: { id: true, firstName: true, lastName: true } },
        reported: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async resolveReport(reportId: string, _action: string) {
    await this.prisma.report.update({
      where: { id: reportId },
      data: { status: 'resolved' },
    });
  }

  async getPlatformSettings() {
    let settings = await this.prisma.platformSettings.findUnique({ where: { id: 'default' } });
    if (!settings) {
      settings = await this.prisma.platformSettings.create({ data: { id: 'default' } });
    }
    return settings;
  }

  async updatePlatformSettings(payload: Record<string, unknown>) {
    return this.prisma.platformSettings.upsert({
      where: { id: 'default' },
      update: payload,
      create: { id: 'default', ...payload },
    });
  }

  async updateCommissionRate(rate: number) {
    return this.prisma.platformSettings.update({
      where: { id: 'default' },
      data: { commissionRate: rate },
    });
  }

  async getAnalytics(range: string) {
    const labels = range === 'week'
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : range === 'month'
        ? Array.from({ length: 4 }, (_, i) => `Week ${i + 1}`)
        : Array.from({ length: 12 }, (_, i) => new Date(2026, i).toLocaleString('en', { month: 'short' }));

    return {
      period: range,
      revenue: labels.map(() => Math.floor(Math.random() * 5000)),
      users: labels.map(() => Math.floor(Math.random() * 100)),
      jobs: labels.map(() => Math.floor(Math.random() * 50)),
      contracts: labels.map(() => Math.floor(Math.random() * 30)),
      labels,
    };
  }

  async exportReport(_type: string, _format: string, _dateRange?: Record<string, string>) {
    return Buffer.from('Report placeholder');
  }
}

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateContractDto, AddMilestoneDto, UpdateMilestoneDto,
  SubmitMilestoneDto, RevisionDto, DisputeDto, ReviewDto,
} from './dto/contract.dto';

@Injectable()
export class ContractsService {
  constructor(private prisma: PrismaService) {}

  async getContracts(userId: string, status?: string) {
    const where = {
      OR: [{ clientId: userId }, { freelancerId: userId }],
      ...(status ? { status } : {}),
    };
    return this.prisma.contract.findMany({
      where,
      include: {
        client: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        freelancer: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        job: { select: { id: true, title: true } },
        milestones: { orderBy: { order: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getContract(id: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        freelancer: { select: { id: true, firstName: true, lastName: true, avatar: true, freelancerProfile: true } },
        job: { select: { id: true, title: true, category: true } },
        milestones: { orderBy: { order: 'asc' } },
        reviews: { include: { author: { select: { id: true, firstName: true, lastName: true, avatar: true } } } },
      },
    });
    if (!contract) throw new NotFoundException('Contract not found');
    return contract;
  }

  async createContract(userId: string, dto: CreateContractDto) {
    const totalAmount = dto.milestones?.reduce((s, m) => s + m.amount, 0) ?? 0;

    const contract = await this.prisma.contract.create({
      data: {
        jobId: dto.jobId,
        clientId: userId,
        freelancerId: dto.freelancerId,
        title: dto.title,
        description: dto.description,
        paymentType: dto.paymentType ?? 'fixed',
        totalAmount,
        status: 'active',
      },
    });

    if (dto.milestones?.length) {
      await this.prisma.milestone.createMany({
        data: dto.milestones.map((m, i) => ({
          contractId: contract.id,
          title: m.title,
          amount: m.amount,
          dueDate: m.dueDate ? new Date(m.dueDate) : null,
          description: m.description,
          order: i,
        })),
      });
    }

    await this.prisma.job.update({ where: { id: dto.jobId }, data: { status: 'in_progress', hiredCount: { increment: 1 } } });

    return this.getContract(contract.id);
  }

  async approveMilestone(contractId: string, milestoneId: string, userId: string) {
    await this.ensureParticipant(contractId, userId);
    return this.prisma.milestone.update({
      where: { id: milestoneId },
      data: { status: 'approved', approvedAt: new Date() },
    });
  }

  async submitMilestone(contractId: string, milestoneId: string, userId: string, dto: SubmitMilestoneDto) {
    await this.ensureParticipant(contractId, userId);
    return this.prisma.milestone.update({
      where: { id: milestoneId },
      data: { status: 'submitted', submittedAt: new Date(), note: dto.note },
    });
  }

  async requestRevision(contractId: string, milestoneId: string, userId: string, dto: RevisionDto) {
    await this.ensureParticipant(contractId, userId);
    return this.prisma.milestone.update({
      where: { id: milestoneId },
      data: { status: 'revision', note: dto.reason },
    });
  }

  async fundMilestone(contractId: string, milestoneId: string, userId: string) {
    await this.ensureParticipant(contractId, userId);
    return this.prisma.milestone.update({
      where: { id: milestoneId },
      data: { status: 'funded' },
    });
  }

  async releaseMilestone(contractId: string, milestoneId: string, userId: string) {
    const contract = await this.ensureParticipant(contractId, userId);
    const milestone = await this.prisma.milestone.update({
      where: { id: milestoneId },
      data: { status: 'released', releasedAt: new Date() },
    });

    await this.prisma.contract.update({
      where: { id: contractId },
      data: { paidAmount: { increment: milestone.amount } },
    });

    await this.prisma.transaction.create({
      data: {
        userId: contract.freelancerId,
        contractId,
        type: 'payment',
        amount: milestone.amount,
        fee: milestone.amount * 0.2,
        net: milestone.amount * 0.8,
        description: `Milestone: ${milestone.title}`,
      },
    });

    return milestone;
  }

  async addMilestone(contractId: string, userId: string, dto: AddMilestoneDto) {
    await this.ensureParticipant(contractId, userId);
    const count = await this.prisma.milestone.count({ where: { contractId } });
    return this.prisma.milestone.create({
      data: {
        contractId,
        title: dto.title,
        amount: dto.amount,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        description: dto.description,
        order: count,
      },
    });
  }

  async updateMilestone(contractId: string, milestoneId: string, userId: string, dto: UpdateMilestoneDto) {
    await this.ensureParticipant(contractId, userId);
    const data: Record<string, unknown> = {};
    if (dto.title) data.title = dto.title;
    if (dto.amount !== undefined) data.amount = dto.amount;
    if (dto.dueDate) data.dueDate = new Date(dto.dueDate);
    if (dto.description) data.description = dto.description;
    return this.prisma.milestone.update({ where: { id: milestoneId }, data });
  }

  async deleteMilestone(contractId: string, milestoneId: string, userId: string) {
    await this.ensureParticipant(contractId, userId);
    await this.prisma.milestone.delete({ where: { id: milestoneId } });
  }

  async openDispute(contractId: string, userId: string, dto: DisputeDto) {
    const contract = await this.ensureParticipant(contractId, userId);
    const respondentId = contract.clientId === userId ? contract.freelancerId : contract.clientId;

    await this.prisma.dispute.create({
      data: {
        contractId,
        initiatorId: userId,
        respondentId,
        reason: dto.reason,
        description: dto.description,
      },
    });

    await this.prisma.contract.update({ where: { id: contractId }, data: { status: 'disputed' } });
  }

  async leaveReview(contractId: string, userId: string, dto: ReviewDto) {
    const contract = await this.ensureParticipant(contractId, userId);
    const targetId = contract.clientId === userId ? contract.freelancerId : contract.clientId;

    return this.prisma.review.create({
      data: {
        contractId,
        authorId: userId,
        targetId,
        rating: dto.rating,
        comment: dto.comment,
        skills: dto.skills as any ?? undefined,
      },
    });
  }

  async endContract(contractId: string, userId: string) {
    await this.ensureParticipant(contractId, userId);
    return this.prisma.contract.update({ where: { id: contractId }, data: { status: 'completed', endDate: new Date() } });
  }

  async pauseContract(contractId: string, userId: string) {
    await this.ensureParticipant(contractId, userId);
    return this.prisma.contract.update({ where: { id: contractId }, data: { status: 'paused' } });
  }

  async resumeContract(contractId: string, userId: string) {
    await this.ensureParticipant(contractId, userId);
    return this.prisma.contract.update({ where: { id: contractId }, data: { status: 'active' } });
  }

  private async ensureParticipant(contractId: string, userId: string) {
    const contract = await this.prisma.contract.findUnique({ where: { id: contractId } });
    if (!contract) throw new NotFoundException('Contract not found');
    if (contract.clientId !== userId && contract.freelancerId !== userId) throw new ForbiddenException();
    return contract;
  }
}

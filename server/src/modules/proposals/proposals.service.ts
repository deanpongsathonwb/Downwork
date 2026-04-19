import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubmitProposalDto, UpdateProposalDto } from './dto/proposal.dto';

@Injectable()
export class ProposalsService {
  constructor(private prisma: PrismaService) {}

  async submit(freelancerId: string, dto: SubmitProposalDto) {
    const proposal = await this.prisma.proposal.create({
      data: {
        jobId: dto.jobId,
        freelancerId,
        coverLetter: dto.coverLetter,
        bidAmount: dto.bidAmount,
        bidType: (dto.bidType as any) ?? 'fixed',
        estimatedDuration: dto.estimatedDuration,
        milestones: (dto.milestones ?? []) as any,
        answers: (dto.answers ?? []) as any,
      },
    });

    await this.prisma.job.update({
      where: { id: dto.jobId },
      data: { proposalCount: { increment: 1 } },
    });

    return this.formatProposal(proposal);
  }

  async getMyProposals(freelancerId: string, status?: string) {
    const where: Record<string, unknown> = { freelancerId };
    if (status) where.status = status;

    const proposals = await this.prisma.proposal.findMany({
      where,
      include: {
        job: { select: { id: true, title: true, category: true, budgetType: true, budgetFixed: true, budgetMin: true, budgetMax: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return proposals.map((p) => this.formatProposal(p));
  }

  async getProposal(id: string) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id },
      include: {
        job: true,
        freelancer: { select: { id: true, firstName: true, lastName: true, avatar: true, freelancerProfile: true } },
      },
    });
    if (!proposal) throw new NotFoundException('Proposal not found');
    return this.formatProposal(proposal);
  }

  async updateProposal(id: string, freelancerId: string, dto: UpdateProposalDto) {
    const proposal = await this.prisma.proposal.findUnique({ where: { id } });
    if (!proposal) throw new NotFoundException();
    if (proposal.freelancerId !== freelancerId) throw new ForbiddenException();

    const data: Record<string, unknown> = {};
    if (dto.coverLetter) data.coverLetter = dto.coverLetter;
    if (dto.bidAmount) data.bidAmount = dto.bidAmount;
    if (dto.estimatedDuration) data.estimatedDuration = dto.estimatedDuration;
    if (dto.milestones) data.milestones = dto.milestones;

    const updated = await this.prisma.proposal.update({ where: { id }, data });
    return this.formatProposal(updated);
  }

  async withdraw(id: string, freelancerId: string) {
    const proposal = await this.prisma.proposal.findUnique({ where: { id } });
    if (!proposal) throw new NotFoundException();
    if (proposal.freelancerId !== freelancerId) throw new ForbiddenException();
    await this.prisma.proposal.delete({ where: { id } });
  }

  async accept(id: string, userId: string) {
    const proposal = await this.prisma.proposal.findUnique({ where: { id }, include: { job: true } });
    if (!proposal) throw new NotFoundException();
    if (proposal.job.clientId !== userId) throw new ForbiddenException();

    return this.prisma.proposal.update({ where: { id }, data: { status: 'accepted' } });
  }

  async reject(id: string, userId: string) {
    const proposal = await this.prisma.proposal.findUnique({ where: { id }, include: { job: true } });
    if (!proposal) throw new NotFoundException();
    if (proposal.job.clientId !== userId) throw new ForbiddenException();

    return this.prisma.proposal.update({ where: { id }, data: { status: 'rejected' } });
  }

  async shortlist(id: string, userId: string) {
    const proposal = await this.prisma.proposal.findUnique({ where: { id }, include: { job: true } });
    if (!proposal) throw new NotFoundException();
    if (proposal.job.clientId !== userId) throw new ForbiddenException();

    return this.prisma.proposal.update({ where: { id }, data: { status: 'shortlisted' } });
  }

  private formatProposal(proposal: Record<string, unknown>) {
    const milestones = proposal.milestones;
    const answers = proposal.answers;
    const attachments = proposal.attachments;
    return {
      ...proposal,
      milestones: milestones ?? [],
      answers: answers ?? [],
      attachments: attachments ?? [],
    };
  }
}

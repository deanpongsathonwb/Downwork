import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateJobDto, UpdateJobDto, JobFilterDto } from './dto/job.dto';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async getJobs(filters: JobFilterDto) {
    const page = filters.page ?? 1;
    const limit = Math.min(filters.limit ?? 12, 50);
    const where: Prisma.JobWhereInput = { status: 'open' };

    if (filters.category) where.category = filters.category;
    if (filters.experienceLevel) where.experienceLevel = filters.experienceLevel as any;
    if (filters.budgetType) where.budgetType = filters.budgetType as any;
    if (filters.duration) where.duration = filters.duration;

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.budgetMin !== undefined || filters.budgetMax !== undefined) {
      where.AND = [
        ...(Array.isArray(where.AND) ? where.AND : []),
        ...(filters.budgetMin !== undefined
          ? [{ OR: [{ budgetFixed: { gte: filters.budgetMin } }, { budgetMax: { gte: filters.budgetMin } }] }]
          : []),
        ...(filters.budgetMax !== undefined
          ? [{ OR: [{ budgetFixed: { lte: filters.budgetMax } }, { budgetMin: { lte: filters.budgetMax } }] }]
          : []),
      ];
    }

    let orderBy: Prisma.JobOrderByWithRelationInput = { createdAt: 'desc' };
    if (filters.sortBy === 'budget_high') orderBy = { budgetFixed: 'desc' };
    if (filters.sortBy === 'budget_low') orderBy = { budgetFixed: 'asc' };

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        include: {
          client: {
            select: { id: true, firstName: true, lastName: true, avatar: true, clientProfile: true },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.job.count({ where }),
    ]);

    return {
      data: jobs.map((j) => this.formatJob(j)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  }

  async getJob(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        client: {
          select: { id: true, firstName: true, lastName: true, avatar: true, clientProfile: true },
        },
      },
    });
    if (!job) throw new NotFoundException('Job not found');

    // Not listed on the public site until the client finishes verification (and job is opened).
    if (job.status === 'draft' || job.status === 'pending_verification') {
      throw new NotFoundException('Job not found');
    }

    await this.prisma.job.update({ where: { id }, data: { viewCount: { increment: 1 } } });

    return this.formatJob(job);
  }

  async createJob(clientId: string, dto: CreateJobDto) {
    const visibility = (dto.visibility as string) ?? 'public';
    /** Private visibility = save as draft; otherwise wait for email/phone verification before going live. */
    const status = visibility === 'private' ? 'draft' : 'pending_verification';

    const job = await this.prisma.job.create({
      data: {
        clientId,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        subcategory: dto.subcategory,
        skills: dto.skills ?? [],
        budgetType: (dto.budgetType as any) ?? 'fixed',
        budgetMin: dto.budgetMin,
        budgetMax: dto.budgetMax,
        budgetFixed: dto.budgetFixed,
        duration: dto.duration,
        experienceLevel: (dto.experienceLevel as any) ?? 'intermediate',
        scope: dto.scope,
        visibility: (dto.visibility as any) ?? 'public',
        screeningQuestions: (dto.screeningQuestions ?? []) as any,
        location: dto.location,
        featured: dto.featured ?? false,
        urgent: dto.urgent ?? false,
        status,
      },
    });
    return this.formatJob(job);
  }

  async updateJob(id: string, userId: string, dto: UpdateJobDto) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.clientId !== userId) throw new ForbiddenException();

    const data: Record<string, unknown> = { ...dto };
    if (dto.skills) data.skills = dto.skills;
    if (dto.screeningQuestions) data.screeningQuestions = dto.screeningQuestions;

    const updated = await this.prisma.job.update({ where: { id }, data });
    return this.formatJob(updated);
  }

  async deleteJob(id: string, userId: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.clientId !== userId) throw new ForbiddenException();
    await this.prisma.job.delete({ where: { id } });
  }

  async getJobProposals(jobId: string, userId: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.clientId !== userId) throw new ForbiddenException();

    return this.prisma.proposal.findMany({
      where: { jobId },
      include: {
        freelancer: {
          select: { id: true, firstName: true, lastName: true, avatar: true, freelancerProfile: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async closeJob(id: string, userId: string) {
    return this.updateJobStatus(id, userId, 'closed');
  }

  async pauseJob(id: string, userId: string) {
    return this.updateJobStatus(id, userId, 'paused');
  }

  async reopenJob(id: string, userId: string) {
    return this.updateJobStatus(id, userId, 'open');
  }

  async getRecommendedJobs() {
    const jobs = await this.prisma.job.findMany({
      where: { status: 'open' },
      include: {
        client: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    return jobs.map((j) => this.formatJob(j));
  }

  async getMyJobs(userId: string, status?: string) {
    const where: Prisma.JobWhereInput = { clientId: userId };
    if (status) where.status = status as any;

    const jobs = await this.prisma.job.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return jobs.map((j) => this.formatJob(j));
  }

  async saveJob(userId: string, jobId: string) {
    await this.prisma.savedJob.upsert({
      where: { userId_jobId: { userId, jobId } },
      create: { userId, jobId },
      update: {},
    });
  }

  async unsaveJob(userId: string, jobId: string) {
    await this.prisma.savedJob.deleteMany({ where: { userId, jobId } });
  }

  async getSavedJobs(userId: string) {
    const saved = await this.prisma.savedJob.findMany({
      where: { userId },
      include: {
        job: {
          include: { client: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
        },
      },
      orderBy: { savedAt: 'desc' },
    });
    return saved.map((s) => ({ ...s, job: this.formatJob(s.job) }));
  }

  async inviteFreelancer(jobId: string, senderId: string, freelancerId: string, message?: string) {
    await this.prisma.invitation.create({
      data: { jobId, senderId, receiverId: freelancerId, message },
    });
  }

  private async updateJobStatus(id: string, userId: string, status: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.clientId !== userId) throw new ForbiddenException();

    const updated = await this.prisma.job.update({ where: { id }, data: { status: status as any } });
    return this.formatJob(updated);
  }

  private formatJob(job: Record<string, unknown>) {
    const skills = job.skills;
    const screeningQuestions = job.screeningQuestions;
    const attachments = job.attachments;
    return {
      ...job,
      skills: skills ?? [],
      screeningQuestions: screeningQuestions ?? [],
      attachments: attachments ?? [],
      budget: {
        type: job.budgetType,
        min: job.budgetMin,
        max: job.budgetMax,
        fixed: job.budgetFixed,
      },
    };
  }
}

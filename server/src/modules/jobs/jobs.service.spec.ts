import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockJob = {
  id: 'job-1',
  clientId: 'client-1',
  title: 'Build a REST API',
  description: 'Need a NestJS developer',
  category: 'Web Development',
  subcategory: 'Backend',
  skills: ['nestjs', 'typescript'],
  budgetType: 'fixed',
  budgetMin: null,
  budgetMax: null,
  budgetFixed: 500,
  duration: '1-3 months',
  experienceLevel: 'intermediate',
  scope: 'medium',
  visibility: 'public',
  status: 'open',
  attachments: [],
  screeningQuestions: [],
  location: null,
  proposalCount: 0,
  viewCount: 5,
  hiredCount: 0,
  featured: false,
  urgent: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  client: {
    id: 'client-1',
    firstName: 'Alice',
    lastName: 'Johnson',
    avatar: null,
    clientProfile: null,
  },
};

describe('JobsService', () => {
  let service: JobsService;
  let prisma: Record<string, any>;

  beforeEach(async () => {
    prisma = {
      job: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      savedJob: {
        upsert: jest.fn(),
        deleteMany: jest.fn(),
        findMany: jest.fn(),
      },
      proposal: { findMany: jest.fn() },
      invitation: { create: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
  });

  // ── getJobs ───────────────────────────────────────────────

  describe('getJobs', () => {
    it('should return paginated data with meta', async () => {
      prisma.job.findMany.mockResolvedValue([mockJob]);
      prisma.job.count.mockResolvedValue(1);

      const result = await service.getJobs({ page: 1, limit: 12 });

      expect(result.data).toHaveLength(1);
      expect(result.meta).toEqual(
        expect.objectContaining({
          page: 1,
          limit: 12,
          total: 1,
          totalPages: 1,
          hasMore: false,
        }),
      );
    });

    it('should default to page 1 and limit 12', async () => {
      prisma.job.findMany.mockResolvedValue([]);
      prisma.job.count.mockResolvedValue(0);

      await service.getJobs({});

      expect(prisma.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 12,
        }),
      );
    });

    it('should cap limit at 50', async () => {
      prisma.job.findMany.mockResolvedValue([]);
      prisma.job.count.mockResolvedValue(0);

      await service.getJobs({ limit: 200 });

      expect(prisma.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 50 }),
      );
    });

    it('should apply category filter', async () => {
      prisma.job.findMany.mockResolvedValue([]);
      prisma.job.count.mockResolvedValue(0);

      await service.getJobs({ category: 'Design' });

      expect(prisma.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ category: 'Design' }),
        }),
      );
    });

    it('should apply experience level filter', async () => {
      prisma.job.findMany.mockResolvedValue([]);
      prisma.job.count.mockResolvedValue(0);

      await service.getJobs({ experienceLevel: 'expert' });

      expect(prisma.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ experienceLevel: 'expert' }),
        }),
      );
    });

    it('should apply search filter using OR on title and description', async () => {
      prisma.job.findMany.mockResolvedValue([]);
      prisma.job.count.mockResolvedValue(0);

      await service.getJobs({ search: 'nestjs' });

      expect(prisma.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { title: { contains: 'nestjs', mode: 'insensitive' } },
              { description: { contains: 'nestjs', mode: 'insensitive' } },
            ],
          }),
        }),
      );
    });

    it('should calculate hasMore correctly', async () => {
      prisma.job.findMany.mockResolvedValue(Array(10).fill(mockJob));
      prisma.job.count.mockResolvedValue(25);

      const result = await service.getJobs({ page: 1, limit: 10 });

      expect(result.meta.hasMore).toBe(true);
      expect(result.meta.totalPages).toBe(3);
    });

    it('should always filter by status open', async () => {
      prisma.job.findMany.mockResolvedValue([]);
      prisma.job.count.mockResolvedValue(0);

      await service.getJobs({});

      expect(prisma.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'open' }),
        }),
      );
    });

    it('should format jobs with budget object', async () => {
      prisma.job.findMany.mockResolvedValue([mockJob]);
      prisma.job.count.mockResolvedValue(1);

      const result = await service.getJobs({});

      expect(result.data[0]).toHaveProperty('budget');
      expect(result.data[0].budget).toEqual({
        type: 'fixed',
        min: null,
        max: null,
        fixed: 500,
      });
    });
  });

  // ── getJob ────────────────────────────────────────────────

  describe('getJob', () => {
    it('should return the job with formatted data', async () => {
      prisma.job.findUnique.mockResolvedValue(mockJob);
      prisma.job.update.mockResolvedValue({});

      const result = await service.getJob('job-1');

      expect(result).toHaveProperty('id', 'job-1');
      expect(result).toHaveProperty('budget');
    });

    it('should increment viewCount', async () => {
      prisma.job.findUnique.mockResolvedValue(mockJob);
      prisma.job.update.mockResolvedValue({});

      await service.getJob('job-1');

      expect(prisma.job.update).toHaveBeenCalledWith({
        where: { id: 'job-1' },
        data: { viewCount: { increment: 1 } },
      });
    });

    it('should throw NotFoundException when job does not exist', async () => {
      prisma.job.findUnique.mockResolvedValue(null);
      await expect(service.getJob('nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('should not expose draft or pending_verification jobs publicly', async () => {
      prisma.job.findUnique.mockResolvedValue({ ...mockJob, status: 'pending_verification' });
      await expect(service.getJob('job-1')).rejects.toThrow(NotFoundException);
      expect(prisma.job.update).not.toHaveBeenCalled();
    });
  });

  // ── createJob ─────────────────────────────────────────────

  describe('createJob', () => {
    const dto = {
      title: 'New Job',
      description: 'Job description',
      category: 'Web Development',
      skills: ['react', 'typescript'],
      budgetType: 'fixed',
      budgetFixed: 1000,
    };

    it('should create a job with the correct client ID', async () => {
      prisma.job.create.mockResolvedValue({ ...mockJob, ...dto, clientId: 'client-1' });

      const result = await service.createJob('client-1', dto as any);

      expect(prisma.job.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            clientId: 'client-1',
            title: dto.title,
            description: dto.description,
            category: dto.category,
            skills: dto.skills,
          }),
        }),
      );
      expect(result).toBeDefined();
    });

    it('should set status to pending_verification for public posts (awaiting verification)', async () => {
      prisma.job.create.mockResolvedValue({ ...mockJob, status: 'pending_verification' });

      await service.createJob('client-1', dto as any);

      expect(prisma.job.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'pending_verification' }),
        }),
      );
    });

    it('should set status to draft when visibility is private (save as draft)', async () => {
      prisma.job.create.mockResolvedValue({ ...mockJob, status: 'draft' });

      await service.createJob('client-1', { ...dto, visibility: 'private' } as any);

      expect(prisma.job.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'draft' }),
        }),
      );
    });

    it('should default skills to empty array when not provided', async () => {
      const noSkillsDto = { title: 'Job', description: 'Desc', category: 'Dev' };
      prisma.job.create.mockResolvedValue({ ...mockJob, skills: [] });

      await service.createJob('client-1', noSkillsDto as any);

      expect(prisma.job.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ skills: [] }),
        }),
      );
    });

    it('should return formatted job with budget object', async () => {
      prisma.job.create.mockResolvedValue({
        ...mockJob,
        ...dto,
        budgetFixed: 1000,
        budgetMin: null,
        budgetMax: null,
      });

      const result = await service.createJob('client-1', dto as any);

      expect(result.budget).toEqual({
        type: 'fixed',
        min: null,
        max: null,
        fixed: 1000,
      });
    });
  });

  // ── updateJob ─────────────────────────────────────────────

  describe('updateJob', () => {
    it('should update job when user is the owner', async () => {
      prisma.job.findUnique.mockResolvedValue(mockJob);
      prisma.job.update.mockResolvedValue({ ...mockJob, title: 'Updated Title' });

      const result = await service.updateJob('job-1', 'client-1', { title: 'Updated Title' });

      expect(prisma.job.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'job-1' },
          data: expect.objectContaining({ title: 'Updated Title' }),
        }),
      );
      expect(result.title).toBe('Updated Title');
    });

    it('should throw ForbiddenException when user is not the owner', async () => {
      prisma.job.findUnique.mockResolvedValue(mockJob);

      await expect(
        service.updateJob('job-1', 'other-user', { title: 'Hacked' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when job does not exist', async () => {
      prisma.job.findUnique.mockResolvedValue(null);

      await expect(
        service.updateJob('nonexistent', 'client-1', { title: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should not call update when ownership check fails', async () => {
      prisma.job.findUnique.mockResolvedValue(mockJob);

      try {
        await service.updateJob('job-1', 'attacker', { title: 'X' });
      } catch {
        // expected
      }

      expect(prisma.job.update).not.toHaveBeenCalled();
    });
  });

  // ── deleteJob ─────────────────────────────────────────────

  describe('deleteJob', () => {
    it('should delete the job when user is the owner', async () => {
      prisma.job.findUnique.mockResolvedValue(mockJob);
      prisma.job.delete.mockResolvedValue({});

      await service.deleteJob('job-1', 'client-1');

      expect(prisma.job.delete).toHaveBeenCalledWith({ where: { id: 'job-1' } });
    });

    it('should throw ForbiddenException when user is not the owner', async () => {
      prisma.job.findUnique.mockResolvedValue(mockJob);

      await expect(service.deleteJob('job-1', 'other-user')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException when job does not exist', async () => {
      prisma.job.findUnique.mockResolvedValue(null);

      await expect(service.deleteJob('nonexistent', 'client-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should not call delete when ownership check fails', async () => {
      prisma.job.findUnique.mockResolvedValue(mockJob);

      try {
        await service.deleteJob('job-1', 'attacker');
      } catch {
        // expected
      }

      expect(prisma.job.delete).not.toHaveBeenCalled();
    });
  });
});

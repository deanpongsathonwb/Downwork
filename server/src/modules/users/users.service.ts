import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { normalizeEmail } from '../../common/utils/normalize-email';
import {
  FreelancerSearchDto,
  UpdateFreelancerProfileDto,
  UpdateClientProfileDto,
  UpdatePasswordDto,
  UpdateAccountDto,
} from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getFreelancers(params: FreelancerSearchDto) {
    const page = params.page ?? 1;
    const limit = Math.min(params.limit ?? 12, 50);

    const where: Prisma.UserWhereInput = {
      role: 'freelancer',
      status: 'active',
      deletedAt: null,
    };

    if (params.search) {
      where.OR = [
        { firstName: { contains: params.search, mode: 'insensitive' } },
        { lastName: { contains: params.search, mode: 'insensitive' } },
        { freelancerProfile: { title: { contains: params.search, mode: 'insensitive' } } },
      ];
    }

    if (params.availability) {
      where.freelancerProfile = {
        ...(where.freelancerProfile as Prisma.FreelancerProfileWhereInput),
        availability: params.availability as any,
      };
    }

    if (params.minRate !== undefined || params.maxRate !== undefined) {
      const rateFilter: Prisma.FreelancerProfileWhereInput = {
        ...(where.freelancerProfile as Prisma.FreelancerProfileWhereInput),
      };
      if (params.minRate !== undefined) rateFilter.hourlyRate = { ...(rateFilter.hourlyRate as any), gte: params.minRate };
      if (params.maxRate !== undefined) rateFilter.hourlyRate = { ...(rateFilter.hourlyRate as any), lte: params.maxRate };
      where.freelancerProfile = rateFilter;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: { freelancerProfile: true },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map((u) => this.mergeFreelancerProfile(u)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  }

  async getFreelancerProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        freelancerProfile: true,
        reviewsReceived: {
          include: {
            author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
          },
        },
      },
    });
    if (!user || user.deletedAt) throw new NotFoundException('User not found');
    return this.mergeFreelancerProfile(user);
  }

  async getClientProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        clientProfile: true,
        reviewsReceived: {
          include: {
            author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
          },
        },
      },
    });
    if (!user || user.deletedAt) throw new NotFoundException('User not found');
    return { ...this.sanitize(user), ...user.clientProfile };
  }

  async updateFreelancerProfile(userId: string, dto: UpdateFreelancerProfileDto) {
    const data: Record<string, unknown> = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.bio !== undefined) data.bio = dto.bio;
    if (dto.hourlyRate !== undefined) data.hourlyRate = dto.hourlyRate;
    if (dto.availability !== undefined) data.availability = dto.availability;
    if (dto.skills) data.skills = dto.skills;
    if (dto.categories) data.categories = dto.categories;
    if (dto.experience) data.experience = dto.experience;
    if (dto.education) data.education = dto.education;
    if (dto.languages) data.languages = dto.languages;
    if (dto.portfolioItems) data.portfolioItems = dto.portfolioItems;

    return this.prisma.freelancerProfile.update({ where: { userId }, data });
  }

  async updateClientProfile(userId: string, dto: UpdateClientProfileDto) {
    return this.prisma.clientProfile.update({ where: { userId }, data: dto });
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    await this.prisma.user.update({ where: { id: userId }, data: { avatar: avatarUrl } });
    return { avatarUrl };
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException();

    const valid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!valid) throw new UnauthorizedException('Current password is incorrect');

    const hashed = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: userId }, data: { password: hashed } }),
      this.prisma.session.deleteMany({ where: { userId } }),
    ]);
  }

  async updateAccount(userId: string, dto: UpdateAccountDto) {
    const data: Prisma.UserUpdateInput = {};

    if (dto.firstName !== undefined) data.firstName = dto.firstName;
    if (dto.lastName !== undefined) data.lastName = dto.lastName;
    if (dto.phone !== undefined) data.phone = dto.phone;
    if (dto.location !== undefined) data.location = dto.location;
    if (dto.timezone !== undefined) data.timezone = dto.timezone;

    if (dto.email !== undefined) {
      const email = normalizeEmail(dto.email);
      const taken = await this.prisma.user.findFirst({
        where: { email, id: { not: userId } },
      });
      if (taken) throw new ConflictException('Email already in use');
      data.email = email;
    }

    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        location: true,
        timezone: true,
        role: true,
        avatar: true,
      },
    });
  }

  async updateNotificationPreferences(userId: string, _prefs: Record<string, boolean>) {
    return { success: true };
  }

  private mergeFreelancerProfile(user: Record<string, unknown>) {
    const fp = user.freelancerProfile as Record<string, unknown> | null;
    const safe = this.sanitize(user);
    if (!fp) return { ...safe, freelancerProfile: null };
    const portfolioItems = fp.portfolioItems ?? [];
    return {
      ...safe,
      userId: fp.userId,
      title: fp.title,
      bio: fp.bio,
      hourlyRate: fp.hourlyRate,
      availability: fp.availability,
      skills: fp.skills ?? [],
      categories: fp.categories ?? [],
      experience: fp.experience ?? [],
      education: fp.education ?? [],
      languages: fp.languages ?? [],
      certifications: fp.certifications ?? [],
      portfolioItems,
      portfolio: portfolioItems,
      totalEarnings: fp.totalEarnings,
      completedJobs: fp.completedJobs,
      totalJobsDone: fp.completedJobs,
      successRate: fp.successRate,
      rating: fp.rating,
      reviewCount: fp.reviewCount,
      totalReviews: fp.reviewCount,
      connectsBalance: fp.connectsBalance,
      profileCompleteness: fp.profileCompleteness,
      freelancerProfile: fp,
    };
  }

  private sanitize(user: Record<string, unknown>) {
    const {
      password,
      twoFactorSecret,
      emailVerifyToken,
      passwordResetToken,
      passwordResetExpires,
      deletedAt,
      ...safe
    } = user;
    return safe;
  }
}

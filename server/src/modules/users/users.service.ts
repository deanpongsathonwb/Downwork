import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
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
    const limit = params.limit ?? 12;

    const where: Record<string, unknown> = { role: 'freelancer', status: 'active' };

    const users = await this.prisma.user.findMany({
      where,
      include: { freelancerProfile: true },
      skip: (page - 1) * limit,
      take: limit,
    });

    let result = users.map((u) => this.mergeFreelancerProfile(u)) as any[];

    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (u: any) =>
          u.firstName?.toLowerCase().includes(q) ||
          u.lastName?.toLowerCase().includes(q) ||
          u.title?.toLowerCase().includes(q),
      );
    }

    if (params.category) {
      result = result.filter((u: any) => {
        const cats: string[] = u.categories ?? [];
        return cats.includes(params.category!);
      });
    }

    if (params.minRate !== undefined) {
      result = result.filter((u: any) => (u.hourlyRate ?? 0) >= params.minRate!);
    }
    if (params.maxRate !== undefined) {
      result = result.filter((u: any) => (u.hourlyRate ?? 999) <= params.maxRate!);
    }

    return result;
  }

  async getFreelancerProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { freelancerProfile: true, reviewsReceived: { include: { author: { select: { id: true, firstName: true, lastName: true, avatar: true } } } } },
    });
    if (!user) throw new NotFoundException('User not found');
    return this.mergeFreelancerProfile(user);
  }

  async getClientProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { clientProfile: true, reviewsReceived: { include: { author: { select: { id: true, firstName: true, lastName: true, avatar: true } } } } },
    });
    if (!user) throw new NotFoundException('User not found');
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
    await this.prisma.user.update({ where: { id: userId }, data: { password: hashed } });
  }

  async updateAccount(userId: string, dto: UpdateAccountDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, location: true, timezone: true, role: true, avatar: true },
    });
  }

  async updateNotificationPreferences(userId: string, _prefs: Record<string, boolean>) {
    // In production this would persist to a notification_preferences table
    return { success: true };
  }

  private mergeFreelancerProfile(user: Record<string, unknown>) {
    const fp = user.freelancerProfile as Record<string, unknown> | null;
    const safe = this.sanitize(user);
    if (!fp) return { ...safe, freelancerProfile: null };
    return {
      ...safe,
      title: fp.title,
      bio: fp.bio,
      hourlyRate: fp.hourlyRate,
      availability: fp.availability,
      skills: fp.skills ?? [],
      categories: fp.categories ?? [],
      experience: fp.experience ?? [],
      education: fp.education ?? [],
      languages: fp.languages ?? [],
      portfolioItems: fp.portfolioItems ?? [],
      totalEarnings: fp.totalEarnings,
      completedJobs: fp.completedJobs,
      successRate: fp.successRate,
      rating: fp.rating,
      reviewCount: fp.reviewCount,
      connectsBalance: fp.connectsBalance,
      freelancerProfile: fp,
    };
  }

  private sanitize(user: Record<string, unknown>) {
    const { password, twoFactorSecret, emailVerifyToken, passwordResetToken, passwordResetExpires, ...safe } = user;
    return safe;
  }
}

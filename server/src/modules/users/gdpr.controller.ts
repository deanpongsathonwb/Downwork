import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('GDPR / Data Privacy')
@ApiBearerAuth()
@Controller('users/me/data')
export class GdprController {
  private readonly logger = new Logger(GdprController.name);

  constructor(private prisma: PrismaService) {}

  @Get('export')
  @ApiOperation({ summary: 'Export all personal data (GDPR Art. 20 – Data Portability)' })
  async exportData(@CurrentUser('id') userId: string) {
    this.logger.log(`Data export requested by user ${userId}`);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        freelancerProfile: true,
        clientProfile: true,
        jobsPosted: true,
        proposals: true,
        contractsAsClient: true,
        contractsAsFreelancer: true,
        reviewsGiven: true,
        reviewsReceived: true,
        transactions: true,
        notifications: true,
        messagesFrom: true,
      },
    });

    if (user) {
      const sensitiveFields = [
        'password',
        'twoFactorSecret',
        'emailVerifyToken',
        'passwordResetToken',
        'passwordResetExpires',
      ];
      for (const field of sensitiveFields) {
        delete (user as any)[field];
      }
    }

    return {
      exportDate: new Date().toISOString(),
      format: 'JSON',
      data: user,
    };
  }

  @Post('erasure-request')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Request account deletion (GDPR Art. 17 – Right to Erasure)' })
  async requestErasure(
    @CurrentUser('id') userId: string,
    @Body() body: { reason?: string },
  ) {
    this.logger.warn(`Erasure request from user ${userId}: ${body.reason ?? 'no reason given'}`);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        status: 'deactivated',
        deletedAt: new Date(),
      },
    });

    return {
      message:
        'Your account has been deactivated and scheduled for permanent deletion within 30 days. ' +
        'Contact support to cancel this request.',
      scheduledDeletionDate: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    };
  }

  @Delete('erasure-cancel')
  @ApiOperation({ summary: 'Cancel a pending erasure request' })
  async cancelErasure(@CurrentUser('id') userId: string) {
    this.logger.log(`Erasure cancellation by user ${userId}`);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        status: 'active',
        deletedAt: null,
      },
    });

    return { message: 'Erasure request cancelled. Your account is active again.' };
  }
}

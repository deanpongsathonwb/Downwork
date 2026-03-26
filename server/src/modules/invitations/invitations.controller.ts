import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

class SendInvitationDto {
  jobId!: string;
  freelancerId!: string;
  message?: string;
}

@Controller('invitations')
export class InvitationsController {
  constructor(private invitationsService: InvitationsService) {}

  @Post()
  send(@CurrentUser('id') userId: string, @Body() dto: SendInvitationDto) {
    return this.invitationsService.send(userId, dto.jobId, dto.freelancerId, dto.message);
  }

  @Get('received')
  getReceived(@CurrentUser('id') userId: string) {
    return this.invitationsService.getReceived(userId);
  }

  @Get('job/:jobId')
  getSentForJob(@Param('jobId') jobId: string) {
    return this.invitationsService.getSentForJob(jobId);
  }

  @Patch(':id/accept')
  accept(@Param('id') id: string) {
    return this.invitationsService.accept(id);
  }

  @Patch(':id/decline')
  decline(@Param('id') id: string) {
    return this.invitationsService.decline(id);
  }
}

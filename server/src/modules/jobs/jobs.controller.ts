import {
  Controller, Get, Post, Put, Delete, Patch,
  Param, Query, Body,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobDto, JobFilterDto, InviteFreelancerDto } from './dto/job.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Public()
  @Get()
  getJobs(@Query() query: JobFilterDto) {
    return this.jobsService.getJobs(query);
  }

  @Public()
  @Get('recommendations')
  getRecommended() {
    return this.jobsService.getRecommendedJobs();
  }

  @Get('my-jobs')
  @Roles('client')
  getMyJobs(@CurrentUser('id') userId: string, @Query('status') status?: string) {
    return this.jobsService.getMyJobs(userId, status);
  }

  @Get('saved')
  getSavedJobs(@CurrentUser('id') userId: string) {
    return this.jobsService.getSavedJobs(userId);
  }

  @Public()
  @Get(':id')
  getJob(@Param('id') id: string) {
    return this.jobsService.getJob(id);
  }

  @Post()
  @Roles('client')
  createJob(@CurrentUser('id') userId: string, @Body() dto: CreateJobDto) {
    return this.jobsService.createJob(userId, dto);
  }

  @Put(':id')
  updateJob(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: UpdateJobDto) {
    return this.jobsService.updateJob(id, userId, dto);
  }

  @Delete(':id')
  deleteJob(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.jobsService.deleteJob(id, userId);
  }

  @Get(':jobId/proposals')
  getJobProposals(@CurrentUser('id') userId: string, @Param('jobId') jobId: string) {
    return this.jobsService.getJobProposals(jobId, userId);
  }

  @Patch(':id/close')
  closeJob(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.jobsService.closeJob(id, userId);
  }

  @Patch(':id/pause')
  pauseJob(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.jobsService.pauseJob(id, userId);
  }

  @Patch(':id/reopen')
  reopenJob(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.jobsService.reopenJob(id, userId);
  }

  @Post(':jobId/save')
  saveJob(@CurrentUser('id') userId: string, @Param('jobId') jobId: string) {
    return this.jobsService.saveJob(userId, jobId);
  }

  @Delete(':jobId/save')
  unsaveJob(@CurrentUser('id') userId: string, @Param('jobId') jobId: string) {
    return this.jobsService.unsaveJob(userId, jobId);
  }

  @Post(':jobId/invite')
  inviteFreelancer(
    @CurrentUser('id') userId: string,
    @Param('jobId') jobId: string,
    @Body() dto: InviteFreelancerDto,
  ) {
    return this.jobsService.inviteFreelancer(jobId, userId, dto.freelancerId, dto.message);
  }
}

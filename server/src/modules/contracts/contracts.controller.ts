import { Controller, Get, Post, Put, Delete, Patch, Param, Query, Body } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import {
  CreateContractDto, AddMilestoneDto, UpdateMilestoneDto,
  SubmitMilestoneDto, RevisionDto, DisputeDto, ReviewDto,
} from './dto/contract.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('contracts')
export class ContractsController {
  constructor(private contractsService: ContractsService) {}

  @Get()
  getContracts(@CurrentUser('id') userId: string, @Query('status') status?: string) {
    return this.contractsService.getContracts(userId, status);
  }

  @Get(':id')
  getContract(@Param('id') id: string) {
    return this.contractsService.getContract(id);
  }

  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateContractDto) {
    return this.contractsService.createContract(userId, dto);
  }

  @Patch(':contractId/milestones/:milestoneId/approve')
  approveMilestone(
    @CurrentUser('id') userId: string,
    @Param('contractId') contractId: string,
    @Param('milestoneId') milestoneId: string,
  ) {
    return this.contractsService.approveMilestone(contractId, milestoneId, userId);
  }

  @Patch(':contractId/milestones/:milestoneId/submit')
  submitMilestone(
    @CurrentUser('id') userId: string,
    @Param('contractId') contractId: string,
    @Param('milestoneId') milestoneId: string,
    @Body() dto: SubmitMilestoneDto,
  ) {
    return this.contractsService.submitMilestone(contractId, milestoneId, userId, dto);
  }

  @Patch(':contractId/milestones/:milestoneId/revise')
  requestRevision(
    @CurrentUser('id') userId: string,
    @Param('contractId') contractId: string,
    @Param('milestoneId') milestoneId: string,
    @Body() dto: RevisionDto,
  ) {
    return this.contractsService.requestRevision(contractId, milestoneId, userId, dto);
  }

  @Patch(':contractId/milestones/:milestoneId/fund')
  fundMilestone(
    @CurrentUser('id') userId: string,
    @Param('contractId') contractId: string,
    @Param('milestoneId') milestoneId: string,
  ) {
    return this.contractsService.fundMilestone(contractId, milestoneId, userId);
  }

  @Patch(':contractId/milestones/:milestoneId/release')
  releaseMilestone(
    @CurrentUser('id') userId: string,
    @Param('contractId') contractId: string,
    @Param('milestoneId') milestoneId: string,
  ) {
    return this.contractsService.releaseMilestone(contractId, milestoneId, userId);
  }

  @Post(':contractId/milestones')
  addMilestone(
    @CurrentUser('id') userId: string,
    @Param('contractId') contractId: string,
    @Body() dto: AddMilestoneDto,
  ) {
    return this.contractsService.addMilestone(contractId, userId, dto);
  }

  @Put(':contractId/milestones/:milestoneId')
  updateMilestone(
    @CurrentUser('id') userId: string,
    @Param('contractId') contractId: string,
    @Param('milestoneId') milestoneId: string,
    @Body() dto: UpdateMilestoneDto,
  ) {
    return this.contractsService.updateMilestone(contractId, milestoneId, userId, dto);
  }

  @Delete(':contractId/milestones/:milestoneId')
  deleteMilestone(
    @CurrentUser('id') userId: string,
    @Param('contractId') contractId: string,
    @Param('milestoneId') milestoneId: string,
  ) {
    return this.contractsService.deleteMilestone(contractId, milestoneId, userId);
  }

  @Post(':contractId/dispute')
  openDispute(
    @CurrentUser('id') userId: string,
    @Param('contractId') contractId: string,
    @Body() dto: DisputeDto,
  ) {
    return this.contractsService.openDispute(contractId, userId, dto);
  }

  @Post(':contractId/review')
  leaveReview(
    @CurrentUser('id') userId: string,
    @Param('contractId') contractId: string,
    @Body() dto: ReviewDto,
  ) {
    return this.contractsService.leaveReview(contractId, userId, dto);
  }

  @Patch(':contractId/end')
  endContract(@CurrentUser('id') userId: string, @Param('contractId') contractId: string) {
    return this.contractsService.endContract(contractId, userId);
  }

  @Patch(':contractId/pause')
  pauseContract(@CurrentUser('id') userId: string, @Param('contractId') contractId: string) {
    return this.contractsService.pauseContract(contractId, userId);
  }

  @Patch(':contractId/resume')
  resumeContract(@CurrentUser('id') userId: string, @Param('contractId') contractId: string) {
    return this.contractsService.resumeContract(contractId, userId);
  }
}

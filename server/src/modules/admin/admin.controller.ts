import { Controller, Get, Put, Patch, Delete, Param, Query, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { AdminService } from './admin.service';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('admin')
@Roles('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  getUsers(@Query() params: Record<string, unknown>) {
    return this.adminService.getUsers(params);
  }

  @Get('users/:userId')
  getUser(@Param('userId') userId: string) {
    return this.adminService.getUser(userId);
  }

  @Patch('users/:userId/ban')
  banUser(@Param('userId') userId: string, @Body('reason') reason: string) {
    return this.adminService.banUser(userId, reason);
  }

  @Patch('users/:userId/unban')
  unbanUser(@Param('userId') userId: string) {
    return this.adminService.unbanUser(userId);
  }

  @Patch('users/:userId/suspend')
  suspendUser(
    @Param('userId') userId: string,
    @Body('days') days: number,
    @Body('reason') reason: string,
  ) {
    return this.adminService.suspendUser(userId, days, reason);
  }

  @Delete('users/:userId')
  deleteUser(@Param('userId') userId: string) {
    return this.adminService.deleteUser(userId);
  }

  @Get('jobs/pending')
  getPendingJobs() {
    return this.adminService.getPendingJobs();
  }

  @Patch('jobs/:jobId/approve')
  approveJob(@Param('jobId') jobId: string) {
    return this.adminService.approveJob(jobId);
  }

  @Patch('jobs/:jobId/reject')
  rejectJob(@Param('jobId') jobId: string, @Body('reason') reason: string) {
    return this.adminService.rejectJob(jobId, reason);
  }

  @Get('disputes')
  getDisputes(@Query('status') status?: string) {
    return this.adminService.getDisputes(status);
  }

  @Get('disputes/:disputeId')
  getDispute(@Param('disputeId') disputeId: string) {
    return this.adminService.getDispute(disputeId);
  }

  @Patch('disputes/:disputeId/resolve')
  resolveDispute(
    @Param('disputeId') disputeId: string,
    @Body('resolution') resolution: string,
    @Body('favorOf') favorOf: string,
  ) {
    return this.adminService.resolveDispute(disputeId, resolution, favorOf);
  }

  @Get('kyc')
  getKYCSubmissions(@Query('status') status?: string) {
    return this.adminService.getKYCSubmissions(status);
  }

  @Patch('kyc/:documentId/approve')
  approveKYC(@Param('documentId') documentId: string) {
    return this.adminService.approveKYC(documentId);
  }

  @Patch('kyc/:documentId/reject')
  rejectKYC(@Param('documentId') documentId: string, @Body('reason') reason: string) {
    return this.adminService.rejectKYC(documentId, reason);
  }

  @Get('reports')
  getReports(@Query('status') status?: string) {
    return this.adminService.getReports(status);
  }

  @Patch('reports/:reportId/resolve')
  resolveReport(@Param('reportId') reportId: string, @Body('action') action: string) {
    return this.adminService.resolveReport(reportId, action);
  }

  @Get('settings')
  getPlatformSettings() {
    return this.adminService.getPlatformSettings();
  }

  @Put('settings')
  updatePlatformSettings(@Body() payload: Record<string, unknown>) {
    return this.adminService.updatePlatformSettings(payload);
  }

  @Patch('settings/commission')
  updateCommissionRate(@Body('rate') rate: number) {
    return this.adminService.updateCommissionRate(rate);
  }

  @Get('analytics')
  getAnalytics(@Query('range') range: 'week' | 'month' | 'year') {
    return this.adminService.getAnalytics(range ?? 'month');
  }

  @Get('reports/export')
  async exportReport(
    @Query('type') type: string,
    @Query('format') format: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Res() res?: Response,
  ) {
    const buffer = await this.adminService.exportReport(type, format, from && to ? { from, to } : undefined);
    res!.set({
      'Content-Type': format === 'pdf' ? 'application/pdf' : 'text/csv',
      'Content-Disposition': `attachment; filename=report.${format}`,
    });
    res!.send(buffer);
  }
}

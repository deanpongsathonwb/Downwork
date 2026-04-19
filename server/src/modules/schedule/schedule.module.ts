import { Module } from '@nestjs/common';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { CleanupService } from './cleanup.service';

@Module({
  imports: [NestScheduleModule.forRoot()],
  providers: [CleanupService],
})
export class AppScheduleModule {}

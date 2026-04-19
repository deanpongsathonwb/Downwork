import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { GdprController } from './gdpr.controller';

@Module({
  controllers: [UsersController, GdprController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

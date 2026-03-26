import {
  Controller, Get, Put, Patch, Param, Query, Body,
  UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../common/config/multer.config';
import { UsersService } from './users.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  FreelancerSearchDto,
  UpdateFreelancerProfileDto,
  UpdateClientProfileDto,
  UpdatePasswordDto,
  UpdateAccountDto,
} from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Get('freelancers')
  getFreelancers(@Query() query: FreelancerSearchDto) {
    return this.usersService.getFreelancers(query);
  }

  @Public()
  @Get(':userId/freelancer-profile')
  getFreelancerProfile(@Param('userId') userId: string) {
    return this.usersService.getFreelancerProfile(userId);
  }

  @Public()
  @Get(':userId/client-profile')
  getClientProfile(@Param('userId') userId: string) {
    return this.usersService.getClientProfile(userId);
  }

  @Put('me/freelancer-profile')
  updateFreelancerProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateFreelancerProfileDto) {
    return this.usersService.updateFreelancerProfile(userId, dto);
  }

  @Put('me/client-profile')
  updateClientProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateClientProfileDto) {
    return this.usersService.updateClientProfile(userId, dto);
  }

  @Put('me/avatar')
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  updateAvatar(@CurrentUser('id') userId: string, @UploadedFile() file: { filename: string }) {
    const avatarUrl = `/uploads/${file.filename}`;
    return this.usersService.updateAvatar(userId, avatarUrl);
  }

  @Put('me/password')
  updatePassword(@CurrentUser('id') userId: string, @Body() dto: UpdatePasswordDto) {
    return this.usersService.updatePassword(userId, dto);
  }

  @Patch('me')
  updateAccount(@CurrentUser('id') userId: string, @Body() dto: UpdateAccountDto) {
    return this.usersService.updateAccount(userId, dto);
  }

  @Put('me/notification-preferences')
  updateNotificationPreferences(
    @CurrentUser('id') userId: string,
    @Body() prefs: Record<string, boolean>,
  ) {
    return this.usersService.updateNotificationPreferences(userId, prefs);
  }
}

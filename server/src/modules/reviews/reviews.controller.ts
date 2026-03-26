import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Public()
  @Get('user/:userId')
  getForUser(@Param('userId') userId: string) {
    return this.reviewsService.getForUser(userId);
  }

  @Public()
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.reviewsService.getById(id);
  }

  @Post(':id/report')
  report(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.reviewsService.report(id, userId, reason);
  }
}

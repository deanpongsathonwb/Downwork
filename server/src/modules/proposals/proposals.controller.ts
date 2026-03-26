import { Controller, Get, Post, Put, Delete, Patch, Param, Query, Body } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { SubmitProposalDto, UpdateProposalDto } from './dto/proposal.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('proposals')
export class ProposalsController {
  constructor(private proposalsService: ProposalsService) {}

  @Post()
  submit(@CurrentUser('id') userId: string, @Body() dto: SubmitProposalDto) {
    return this.proposalsService.submit(userId, dto);
  }

  @Get()
  getMyProposals(@CurrentUser('id') userId: string, @Query('status') status?: string) {
    return this.proposalsService.getMyProposals(userId, status);
  }

  @Get(':id')
  getProposal(@Param('id') id: string) {
    return this.proposalsService.getProposal(id);
  }

  @Put(':id')
  update(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: UpdateProposalDto) {
    return this.proposalsService.updateProposal(id, userId, dto);
  }

  @Delete(':id')
  withdraw(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.proposalsService.withdraw(id, userId);
  }

  @Patch(':id/accept')
  accept(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.proposalsService.accept(id, userId);
  }

  @Patch(':id/reject')
  reject(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.proposalsService.reject(id, userId);
  }

  @Patch(':id/shortlist')
  shortlist(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.proposalsService.shortlist(id, userId);
  }
}

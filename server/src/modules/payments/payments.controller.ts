import { Controller, Get, Post, Delete, Patch, Param, Query, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { PaymentsService } from './payments.service';
import { WithdrawalDto, AddFundsDto, AddPaymentMethodDto, BuyConnectsDto } from './dto/payment.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get('balance')
  getBalance(@CurrentUser('id') userId: string) {
    return this.paymentsService.getBalance(userId);
  }

  @Get('earnings')
  getEarnings(@CurrentUser('id') userId: string) {
    return this.paymentsService.getEarnings(userId);
  }

  @Get('transactions')
  getTransactions(@CurrentUser('id') userId: string) {
    return this.paymentsService.getTransactions(userId);
  }

  @Post('withdrawals')
  requestWithdrawal(@CurrentUser('id') userId: string, @Body() dto: WithdrawalDto) {
    return this.paymentsService.requestWithdrawal(userId, dto);
  }

  @Get('withdrawals')
  getWithdrawals(@CurrentUser('id') userId: string) {
    return this.paymentsService.getWithdrawals(userId);
  }

  @Get('methods')
  getPaymentMethods(@CurrentUser('id') userId: string) {
    return this.paymentsService.getPaymentMethods(userId);
  }

  @Post('methods')
  addPaymentMethod(@CurrentUser('id') userId: string, @Body() dto: AddPaymentMethodDto) {
    return this.paymentsService.addPaymentMethod(userId, dto);
  }

  @Delete('methods/:id')
  removePaymentMethod(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.paymentsService.removePaymentMethod(userId, id);
  }

  @Patch('methods/:id/default')
  setDefault(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.paymentsService.setDefaultPaymentMethod(userId, id);
  }

  @Post('add-funds')
  addFunds(@CurrentUser('id') userId: string, @Body() dto: AddFundsDto) {
    return this.paymentsService.addFunds(userId, dto);
  }

  @Get('connects')
  getConnectsBalance(@CurrentUser('id') userId: string) {
    return this.paymentsService.getConnectsBalance(userId);
  }

  @Post('connects/buy')
  buyConnects(@CurrentUser('id') userId: string, @Body() dto: BuyConnectsDto) {
    return this.paymentsService.buyConnects(userId, dto.packageId);
  }

  @Get('connects/packages')
  getConnectsPackages() {
    return this.paymentsService.getConnectsPackages();
  }

  @Get('transactions/:transactionId/invoice')
  async downloadInvoice(
    @CurrentUser('id') userId: string,
    @Param('transactionId') transactionId: string,
    @Res() res: Response,
  ) {
    const buffer = await this.paymentsService.downloadInvoice(userId, transactionId);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename=invoice.pdf' });
    res.send(buffer);
  }
}

import { IsOptional, IsString, IsNumber, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class WithdrawalDto {
  @Type(() => Number) @IsNumber() amount!: number;
  @IsString() paymentMethodId!: string;
}

export class AddFundsDto {
  @Type(() => Number) @IsNumber() amount!: number;
  @IsString() paymentMethodId!: string;
}

export class AddPaymentMethodDto {
  @IsIn(['card', 'bank_account', 'paypal']) type!: string;
  @IsString() label!: string;
  @IsOptional() @IsString() last4?: string;
  @IsOptional() @IsString() brand?: string;
}

export class BuyConnectsDto {
  @IsString() packageId!: string;
}

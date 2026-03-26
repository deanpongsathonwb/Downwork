import { IsOptional, IsString } from 'class-validator';

export class StartConversationDto {
  @IsString() recipientId!: string;
  @IsOptional() @IsString() jobId?: string;
}

export class SendMessageDto {
  @IsString() content!: string;
  @IsOptional() @IsString() type?: string;
}

export class SendOfferDto {
  @IsOptional() title?: string;
  @IsOptional() amount?: number;
  @IsOptional() description?: string;
  @IsOptional() duration?: string;
}

import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateContractDto {
  @IsString() jobId!: string;
  @IsString() freelancerId!: string;
  @IsString() title!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() paymentType?: string;
  @IsOptional() @IsArray() milestones?: { title: string; amount: number; dueDate?: string; description?: string }[];
}

export class AddMilestoneDto {
  @IsString() title!: string;
  @Type(() => Number) @IsNumber() amount!: number;
  @IsOptional() @IsString() dueDate?: string;
  @IsOptional() @IsString() description?: string;
}

export class UpdateMilestoneDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @Type(() => Number) @IsNumber() amount?: number;
  @IsOptional() @IsString() dueDate?: string;
  @IsOptional() @IsString() description?: string;
}

export class SubmitMilestoneDto {
  @IsOptional() @IsString() note?: string;
}

export class RevisionDto {
  @IsString() reason!: string;
}

export class DisputeDto {
  @IsString() reason!: string;
  @IsString() description!: string;
}

export class ReviewDto {
  @Type(() => Number) @IsNumber() rating!: number;
  @IsOptional() @IsString() comment?: string;
  @IsOptional() skills?: Record<string, number>;
}

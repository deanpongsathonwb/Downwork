import { IsOptional, IsString, IsNumber, IsArray, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class SubmitProposalDto {
  @IsString() jobId!: string;
  @IsString() coverLetter!: string;
  @Type(() => Number) @IsNumber() bidAmount!: number;
  @IsOptional() @IsIn(['fixed', 'hourly']) bidType?: string;
  @IsOptional() @IsString() estimatedDuration?: string;
  @IsOptional() @IsArray() milestones?: unknown[];
  @IsOptional() @IsArray() answers?: unknown[];
}

export class UpdateProposalDto {
  @IsOptional() @IsString() coverLetter?: string;
  @IsOptional() @Type(() => Number) @IsNumber() bidAmount?: number;
  @IsOptional() @IsString() estimatedDuration?: string;
  @IsOptional() @IsArray() milestones?: unknown[];
}

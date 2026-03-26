import { IsOptional, IsString, IsNumber, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class FreelancerSearchDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) minRate?: number;
  @IsOptional() @Type(() => Number) @IsNumber() maxRate?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) @Max(5) rating?: number;
  @IsOptional() @IsIn(['available', 'busy', 'not_available']) availability?: string;
  @IsOptional() @IsString() sortBy?: string;
  @IsOptional() @Type(() => Number) page?: number;
  @IsOptional() @Type(() => Number) limit?: number;
}

export class UpdateFreelancerProfileDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() bio?: string;
  @IsOptional() @Type(() => Number) @IsNumber() hourlyRate?: number;
  @IsOptional() @IsIn(['available', 'busy', 'not_available']) availability?: string;
  @IsOptional() skills?: string[];
  @IsOptional() categories?: string[];
  @IsOptional() experience?: unknown[];
  @IsOptional() education?: unknown[];
  @IsOptional() languages?: unknown[];
  @IsOptional() portfolioItems?: unknown[];
}

export class UpdateClientProfileDto {
  @IsOptional() @IsString() companyName?: string;
  @IsOptional() @IsString() companySize?: string;
  @IsOptional() @IsString() industry?: string;
  @IsOptional() @IsString() website?: string;
  @IsOptional() @IsString() description?: string;
}

export class UpdatePasswordDto {
  @IsString() currentPassword!: string;
  @IsString() newPassword!: string;
}

export class UpdateAccountDto {
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() timezone?: string;
}

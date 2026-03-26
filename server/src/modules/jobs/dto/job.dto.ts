import { IsOptional, IsString, IsNumber, IsArray, IsIn, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateJobDto {
  @IsString() title!: string;
  @IsString() description!: string;
  @IsString() category!: string;
  @IsOptional() @IsString() subcategory?: string;
  @IsOptional() @IsArray() skills?: string[];
  @IsOptional() @IsIn(['fixed', 'hourly']) budgetType?: string;
  @IsOptional() @Type(() => Number) @IsNumber() budgetMin?: number;
  @IsOptional() @Type(() => Number) @IsNumber() budgetMax?: number;
  @IsOptional() @Type(() => Number) @IsNumber() budgetFixed?: number;
  @IsOptional() @IsString() duration?: string;
  @IsOptional() @IsIn(['entry', 'intermediate', 'expert']) experienceLevel?: string;
  @IsOptional() @IsString() scope?: string;
  @IsOptional() @IsIn(['public', 'private', 'invite_only']) visibility?: string;
  @IsOptional() @IsArray() screeningQuestions?: unknown[];
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsBoolean() urgent?: boolean;
}

export class UpdateJobDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsArray() skills?: string[];
  @IsOptional() @IsIn(['fixed', 'hourly']) budgetType?: string;
  @IsOptional() @Type(() => Number) @IsNumber() budgetMin?: number;
  @IsOptional() @Type(() => Number) @IsNumber() budgetMax?: number;
  @IsOptional() @Type(() => Number) @IsNumber() budgetFixed?: number;
  @IsOptional() @IsString() duration?: string;
  @IsOptional() @IsIn(['entry', 'intermediate', 'expert']) experienceLevel?: string;
  @IsOptional() @IsArray() screeningQuestions?: unknown[];
}

export class JobFilterDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsIn(['fixed', 'hourly']) budgetType?: string;
  @IsOptional() @Type(() => Number) @IsNumber() budgetMin?: number;
  @IsOptional() @Type(() => Number) @IsNumber() budgetMax?: number;
  @IsOptional() @IsIn(['entry', 'intermediate', 'expert']) experienceLevel?: string;
  @IsOptional() @IsString() duration?: string;
  @IsOptional() @IsString() sortBy?: string;
  @IsOptional() @Type(() => Number) page?: number;
  @IsOptional() @Type(() => Number) limit?: number;
}

export class InviteFreelancerDto {
  @IsString() freelancerId!: string;
  @IsOptional() @IsString() message?: string;
}

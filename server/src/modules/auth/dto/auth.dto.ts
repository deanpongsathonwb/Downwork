import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsString()
  twoFactorCode?: string;
}

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsIn(['freelancer', 'client'])
  role!: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  email!: string;
}

export class ResetPasswordDto {
  @IsString()
  token!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

export class VerifyEmailDto {
  @IsString()
  token!: string;
}

export class TwoFactorCodeDto {
  @IsString()
  code!: string;
}

export class ChangeEmailDto {
  @IsEmail()
  newEmail!: string;

  @IsString()
  password!: string;
}

export class DeleteAccountDto {
  @IsString()
  password!: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken!: string;
}

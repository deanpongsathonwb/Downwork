import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsIn,
  Matches,
  ValidateIf,
} from 'class-validator';

export class LoginDto {
  /** Email or username (validated in AuthService). */
  @IsString()
  @MinLength(1, { message: 'Please enter your username or email.' })
  @MaxLength(320)
  email!: string;

  @IsString()
  password!: string;

  @IsOptional()
  @IsString()
  twoFactorCode?: string;
}

/** Query for GET /auth/register/email-available */
export class RegisterEmailAvailabilityQueryDto {
  @IsEmail()
  email!: string;
}

export class RegisterDto {
  @IsEmail()
  email!: string;

  @ValidateIf((o) => typeof o.username === 'string' && o.username.trim().length > 0)
  @IsString()
  @Matches(/^[a-zA-Z0-9._-]{3,32}$/, {
    message: 'Username must be 3–32 characters (letters, numbers, . _ -).',
  })
  username?: string;

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

import { Controller, Post, Get, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
  TwoFactorCodeDto,
  ChangeEmailDto,
  DeleteAccountDto,
  RefreshTokenDto,
} from './dto/auth.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUser('id') userId: string) {
    return this.authService.logout(userId);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto.token);
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  resendVerification(@CurrentUser('id') userId: string) {
    return this.authService.resendVerification(userId);
  }

  @Get('me')
  getMe(@CurrentUser('id') userId: string) {
    return this.authService.getMe(userId);
  }

  @Post('2fa/setup')
  setup2FA(@CurrentUser('id') userId: string) {
    return this.authService.setup2FA(userId);
  }

  @Post('2fa/verify')
  @HttpCode(HttpStatus.OK)
  verify2FA(@CurrentUser('id') userId: string, @Body() dto: TwoFactorCodeDto) {
    return this.authService.verify2FA(userId, dto.code);
  }

  @Post('2fa/disable')
  @HttpCode(HttpStatus.OK)
  disable2FA(@CurrentUser('id') userId: string, @Body() dto: TwoFactorCodeDto) {
    return this.authService.disable2FA(userId, dto.code);
  }

  @Post('change-email')
  @HttpCode(HttpStatus.OK)
  changeEmail(@CurrentUser('id') userId: string, @Body() dto: ChangeEmailDto) {
    return this.authService.changeEmail(userId, dto);
  }

  @Post('delete-account')
  @HttpCode(HttpStatus.OK)
  deleteAccount(@CurrentUser('id') userId: string, @Body() dto: DeleteAccountDto) {
    return this.authService.deleteAccount(userId, dto.password);
  }

  @Post('deactivate')
  @HttpCode(HttpStatus.OK)
  deactivate(@CurrentUser('id') userId: string) {
    return this.authService.deactivateAccount(userId);
  }

  @Get('sessions')
  getSessions(@CurrentUser('id') userId: string) {
    return this.authService.getSessions(userId);
  }

  @Delete('sessions/:sessionId')
  revokeSession(@CurrentUser('id') userId: string, @Param('sessionId') sessionId: string) {
    return this.authService.revokeSession(userId, sessionId);
  }

  @Delete('sessions')
  revokeAllSessions(@CurrentUser('id') userId: string) {
    return this.authService.revokeAllSessions(userId);
  }
}

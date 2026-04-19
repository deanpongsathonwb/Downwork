import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  Inject,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { PrismaService } from '../../prisma/prisma.service';
import { normalizeEmail } from '../../common/utils/normalize-email';
import {
  looksLikeEmail,
  normalizeUsername,
  isValidUsernameNormalized,
  USERNAME_MAX,
} from '../../common/utils/normalize-username';
import { LoginDto, RegisterDto, ResetPasswordDto, ChangeEmailDto } from './dto/auth.dto';
import { EMAIL_SERVICE, type EmailService } from '../email/email.interface';
import { EmailTemplates } from '../email/email.templates';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    @Inject(EMAIL_SERVICE) private emailService: EmailService,
    private emailTemplates: EmailTemplates,
  ) {}

  /** Public registration flow: true if no user with this normalized email. */
  async isRegisterEmailAvailable(rawEmail: string): Promise<{ available: boolean }> {
    const email = normalizeEmail(rawEmail);
    const existing = await this.prisma.user.findUnique({ where: { email } });
    return { available: !existing };
  }

  async register(dto: RegisterDto) {
    const email = normalizeEmail(dto.email);
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 12);
    const emailVerifyToken = randomBytes(32).toString('hex');
    const username = await this.pickUsername(dto, email);

    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashed,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role as any,
        emailVerifyToken,
      },
    });

    if (dto.role === 'freelancer') {
      await this.prisma.freelancerProfile.create({ data: { userId: user.id } });
    } else if (dto.role === 'client') {
      await this.prisma.clientProfile.create({ data: { userId: user.id } });
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.createSession(user.id, tokens.refreshToken, 'Registration');

    const template = this.emailTemplates.verifyEmail(user.firstName, emailVerifyToken);
    await this.emailService.send({ to: user.email, ...template }).catch((err) => {
      this.logger.error(`Failed to send verification email to ${user.email}`, err);
    });

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.findUserForLogin(dto.email);
    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Username or password is incorrect.');
    }

    if (user.status === 'banned') throw new UnauthorizedException('Account banned');
    if (user.status === 'deactivated') throw new UnauthorizedException('Account deactivated');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Username or password is incorrect.');

    if (user.twoFactorEnabled) {
      if (!dto.twoFactorCode) {
        throw new BadRequestException('Two-factor code required');
      }
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret!,
        encoding: 'base32',
        token: dto.twoFactorCode,
        window: 1,
      });
      if (!verified) throw new UnauthorizedException('Invalid 2FA code');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.createSession(user.id, tokens.refreshToken, 'Login');

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await this.prisma.session.deleteMany({ where: { userId, token: refreshToken } });
    }
  }

  async refreshToken(token: string) {
    const session = await this.prisma.session.findUnique({ where: { token } });
    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await this.prisma.session.delete({ where: { id: session.id } });
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({ where: { id: session.userId } });
    if (!user || user.deletedAt) throw new UnauthorizedException();

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    await this.prisma.session.update({
      where: { id: session.id },
      data: { token: tokens.refreshToken, lastActive: new Date() },
    });

    return tokens;
  }

  async forgotPassword(email: string) {
    const normalized = normalizeEmail(email);
    const user = await this.prisma.user.findUnique({ where: { email: normalized } });
    if (!user || user.deletedAt) return;

    const resetToken = randomBytes(32).toString('hex');
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: new Date(Date.now() + 3600000),
      },
    });

    const template = this.emailTemplates.resetPassword(user.firstName, resetToken);
    await this.emailService.send({ to: user.email, ...template }).catch((err) => {
      this.logger.error(`Failed to send reset email to ${user.email}`, err);
    });
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: dto.token,
        passwordResetExpires: { gt: new Date() },
      },
    });
    if (!user) throw new BadRequestException('Invalid or expired reset token');

    const hashed = await bcrypt.hash(dto.password, 12);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashed,
          passwordResetToken: null,
          passwordResetExpires: null,
        },
      }),
      this.prisma.session.deleteMany({ where: { userId: user.id } }),
    ]);
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({ where: { emailVerifyToken: token } });
    if (!user) throw new BadRequestException('Invalid verification token');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isEmailVerified: true, emailVerifyToken: null },
    });
  }

  async resendVerification(userId: string) {
    const token = randomBytes(32).toString('hex');
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { emailVerifyToken: token },
    });

    const template = this.emailTemplates.verifyEmail(user.firstName, token);
    await this.emailService.send({ to: user.email, ...template }).catch((err) => {
      this.logger.error(`Failed to send verification email to ${user.email}`, err);
    });
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { freelancerProfile: true, clientProfile: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return this.sanitizeUser(user);
  }

  async setup2FA(userId: string) {
    const secret = speakeasy.generateSecret({ name: 'Downwork', length: 20 });
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret.base32 },
    });
    const qrCode = await QRCode.toDataURL(secret.otpauth_url!);
    return { qrCode };
  }

  async verify2FA(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.twoFactorSecret) throw new BadRequestException('2FA not set up');

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 1,
    });
    if (!verified) throw new BadRequestException('Invalid 2FA code');

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });
  }

  async disable2FA(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.twoFactorSecret) throw new BadRequestException('2FA not enabled');

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 1,
    });
    if (!verified) throw new BadRequestException('Invalid 2FA code');

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: false, twoFactorSecret: null },
    });
  }

  async changeEmail(userId: string, dto: ChangeEmailDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException();

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid password');

    const newEmail = normalizeEmail(dto.newEmail);
    const existing = await this.prisma.user.findUnique({ where: { email: newEmail } });
    if (existing) throw new ConflictException('Email already in use');

    const verifyToken = randomBytes(32).toString('hex');
    await this.prisma.user.update({
      where: { id: userId },
      data: { email: newEmail, isEmailVerified: false, emailVerifyToken: verifyToken },
    });

    const template = this.emailTemplates.emailChanged(user.firstName, verifyToken);
    await this.emailService.send({ to: newEmail, ...template }).catch((err) => {
      this.logger.error(`Failed to send email change verification to ${newEmail}`, err);
    });
  }

  async deleteAccount(userId: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException();

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid password');

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { deletedAt: new Date(), status: 'deactivated', email: `deleted_${userId}@deleted.local` },
      }),
      this.prisma.session.deleteMany({ where: { userId } }),
    ]);
  }

  async deactivateAccount(userId: string) {
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { status: 'deactivated' },
      }),
      this.prisma.session.deleteMany({ where: { userId } }),
    ]);
  }

  async getSessions(userId: string) {
    const sessions = await this.prisma.session.findMany({
      where: { userId },
      orderBy: { lastActive: 'desc' },
    });
    return sessions.map((s) => ({
      id: s.id,
      device: s.device,
      ip: s.ip,
      lastActive: s.lastActive.toISOString(),
      isCurrent: false,
    }));
  }

  async revokeSession(userId: string, sessionId: string) {
    await this.prisma.session.deleteMany({ where: { id: sessionId, userId } });
  }

  async revokeAllSessions(userId: string) {
    await this.prisma.session.deleteMany({ where: { userId } });
  }

  // ── Helpers ──

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('jwt.accessSecret'),
        expiresIn: this.config.get<number>('jwt.accessExpiresIn', 3600),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('jwt.refreshSecret'),
        expiresIn: this.config.get<number>('jwt.refreshExpiresIn', 604800),
      }),
    ]);
    return { accessToken, refreshToken };
  }

  private async createSession(userId: string, token: string, device: string) {
    const expiresIn = this.config.get<number>('jwt.refreshExpiresIn', 604800);
    await this.prisma.session.create({
      data: {
        userId,
        token,
        device,
        expiresAt: new Date(Date.now() + expiresIn * 1000),
      },
    });
  }

  private async findUserForLogin(identifier: string) {
    const raw = identifier.trim();
    if (!raw) return null;
    if (looksLikeEmail(raw)) {
      const email = normalizeEmail(raw);
      return this.prisma.user.findUnique({ where: { email } });
    }
    const username = normalizeUsername(raw);
    if (!isValidUsernameNormalized(username)) {
      throw new BadRequestException('Please enter a valid email address or username.');
    }
    return this.prisma.user.findFirst({ where: { username } });
  }

  private async pickUsername(dto: RegisterDto, normalizedEmail: string): Promise<string> {
    if (dto.username?.trim()) {
      const u = normalizeUsername(dto.username);
      if (!isValidUsernameNormalized(u)) {
        throw new BadRequestException(
          'Username must be 3–32 characters (letters, numbers, . _ -).',
        );
      }
      const taken = await this.prisma.user.findFirst({ where: { username: u } });
      if (taken) throw new ConflictException('Username already taken');
      return u;
    }
    return this.allocateUniqueUsernameFromEmail(normalizedEmail);
  }

  private async allocateUniqueUsernameFromEmail(normalizedEmail: string): Promise<string> {
    const local = normalizedEmail.split('@')[0] ?? 'user';
    let base = normalizeUsername(local);
    if (base.length < 3) {
      base = `u${randomBytes(4).toString('hex').slice(0, 7)}`;
    }
    base = base.slice(0, USERNAME_MAX);
    let candidate = base;
    for (let i = 0; i < 50; i++) {
      const exists = await this.prisma.user.findFirst({ where: { username: candidate } });
      if (!exists) return candidate;
      const suffix = randomBytes(2).toString('hex');
      candidate = `${base.slice(0, Math.max(3, USERNAME_MAX - suffix.length))}${suffix}`;
    }
    throw new ConflictException('Could not allocate username; try again.');
  }

  private sanitizeUser(user: Record<string, unknown>) {
    const {
      password,
      twoFactorSecret,
      emailVerifyToken,
      passwordResetToken,
      passwordResetExpires,
      deletedAt,
      ...safe
    } = user;
    return safe;
  }
}

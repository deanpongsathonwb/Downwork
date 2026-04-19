import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EMAIL_SERVICE, type EmailService } from '../email/email.interface';
import { EmailTemplates } from '../email/email.templates';

jest.mock('bcryptjs');
jest.mock('speakeasy');
jest.mock('qrcode');

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  username: 'testuser',
  password: 'hashed-password',
  firstName: 'John',
  lastName: 'Doe',
  role: 'freelancer',
  status: 'active',
  isEmailVerified: false,
  emailVerifyToken: null,
  passwordResetToken: null,
  passwordResetExpires: null,
  twoFactorSecret: null,
  twoFactorEnabled: false,
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthService', () => {
  let service: AuthService;
  let prisma: Record<string, any>;
  let jwtService: { signAsync: jest.Mock };
  let configService: { get: jest.Mock };
  let emailService: { send: jest.Mock };
  let emailTemplates: { verifyEmail: jest.Mock; resetPassword: jest.Mock; emailChanged: jest.Mock };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      freelancerProfile: { create: jest.fn() },
      clientProfile: { create: jest.fn() },
      session: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
    };

    configService = {
      get: jest.fn((key: string, fallback?: unknown) => {
        const map: Record<string, unknown> = {
          'jwt.accessSecret': 'access-secret',
          'jwt.refreshSecret': 'refresh-secret',
          'jwt.accessExpiresIn': 3600,
          'jwt.refreshExpiresIn': 604800,
        };
        return map[key] ?? fallback;
      }),
    };

    emailService = { send: jest.fn().mockResolvedValue(undefined) };

    emailTemplates = {
      verifyEmail: jest.fn().mockReturnValue({ subject: 'Verify', html: '<p>verify</p>' }),
      resetPassword: jest.fn().mockReturnValue({ subject: 'Reset', html: '<p>reset</p>' }),
      emailChanged: jest.fn().mockReturnValue({ subject: 'Changed', html: '<p>changed</p>' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
        { provide: EMAIL_SERVICE, useValue: emailService },
        { provide: EmailTemplates, useValue: emailTemplates },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    jwtService.signAsync
      .mockResolvedValueOnce('access-token')
      .mockResolvedValueOnce('refresh-token');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ── register ──────────────────────────────────────────────

  describe('register', () => {
    const dto = {
      email: 'new@example.com',
      password: 'password123',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'freelancer',
    };

    beforeEach(() => {
      prisma.user.findFirst.mockResolvedValue(null);
    });

    it('should throw ConflictException when email already exists', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });

    it('should normalize email for duplicate check and storage', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ ...mockUser, email: 'mixed@example.com' });
      prisma.freelancerProfile.create.mockResolvedValue({});
      prisma.session.create.mockResolvedValue({});

      await service.register({
        ...dto,
        email: '  Mixed@EXAMPLE.COM ',
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'mixed@example.com' },
      });
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ email: 'mixed@example.com' }),
        }),
      );
    });

    it('should create user and freelancer profile for freelancer role', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ ...mockUser, email: dto.email });
      prisma.freelancerProfile.create.mockResolvedValue({});
      prisma.session.create.mockResolvedValue({});

      const result = await service.register(dto);

      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: 'new@example.com',
            username: 'new',
            firstName: dto.firstName,
            lastName: dto.lastName,
            role: dto.role,
          }),
        }),
      );
      expect(prisma.freelancerProfile.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: { userId: mockUser.id } }),
      );
      expect(result.tokens).toBeDefined();
      expect(result.user).toBeDefined();
    });

    it('should create client profile for client role', async () => {
      const clientDto = { ...dto, role: 'client' };
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ ...mockUser, role: 'client' });
      prisma.clientProfile.create.mockResolvedValue({});
      prisma.session.create.mockResolvedValue({});

      await service.register(clientDto);

      expect(prisma.clientProfile.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: { userId: mockUser.id } }),
      );
      expect(prisma.freelancerProfile.create).not.toHaveBeenCalled();
    });

    it('should generate access and refresh tokens', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ ...mockUser, email: dto.email });
      prisma.freelancerProfile.create.mockResolvedValue({});
      prisma.session.create.mockResolvedValue({});

      const result = await service.register(dto);

      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(result.tokens.accessToken).toBe('access-token');
      expect(result.tokens.refreshToken).toBe('refresh-token');
    });

    it('should send verification email', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ ...mockUser, email: dto.email });
      prisma.freelancerProfile.create.mockResolvedValue({});
      prisma.session.create.mockResolvedValue({});

      await service.register(dto);

      expect(emailTemplates.verifyEmail).toHaveBeenCalledWith(
        mockUser.firstName,
        expect.any(String),
      );
      expect(emailService.send).toHaveBeenCalledWith(
        expect.objectContaining({ to: dto.email }),
      );
    });

    it('should not throw if email send fails', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ ...mockUser, email: dto.email });
      prisma.freelancerProfile.create.mockResolvedValue({});
      prisma.session.create.mockResolvedValue({});
      emailService.send.mockRejectedValue(new Error('SMTP down'));

      await expect(service.register(dto)).resolves.toBeDefined();
    });

    it('should hash the password before storing', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ ...mockUser, email: dto.email });
      prisma.freelancerProfile.create.mockResolvedValue({});
      prisma.session.create.mockResolvedValue({});

      await service.register(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 12);
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ password: 'hashed-password' }),
        }),
      );
    });

    it('should sanitize user in the response (no password or secrets)', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ ...mockUser, email: dto.email });
      prisma.freelancerProfile.create.mockResolvedValue({});
      prisma.session.create.mockResolvedValue({});

      const result = await service.register(dto);

      expect(result.user).not.toHaveProperty('password');
      expect(result.user).not.toHaveProperty('twoFactorSecret');
      expect(result.user).not.toHaveProperty('passwordResetToken');
    });
  });

  // ── login ─────────────────────────────────────────────────

  describe('login', () => {
    const dto = { email: 'test@example.com', password: 'password123' };

    it('should return user and tokens on valid credentials', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.session.create.mockResolvedValue({});

      const result = await service.login(dto);

      expect(result.user).toBeDefined();
      expect(result.tokens.accessToken).toBe('access-token');
      expect(result.tokens.refreshToken).toBe('refresh-token');
    });

    it('should normalize email casing and whitespace for lookup', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.session.create.mockResolvedValue({});

      await service.login({ email: '  Test@EXAMPLE.com ', password: 'password123' });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should resolve user by username when identifier is not an email', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.findFirst.mockResolvedValue(mockUser);
      prisma.session.create.mockResolvedValue({});

      await service.login({ email: 'TestUser', password: 'password123' });

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for soft-deleted user', async () => {
      prisma.user.findUnique.mockResolvedValue({ ...mockUser, deletedAt: new Date() });
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for banned users', async () => {
      prisma.user.findUnique.mockResolvedValue({ ...mockUser, status: 'banned' });
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for deactivated users', async () => {
      prisma.user.findUnique.mockResolvedValue({ ...mockUser, status: 'deactivated' });
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw BadRequestException when 2FA is enabled but no code provided', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        twoFactorEnabled: true,
        twoFactorSecret: 'secret',
      });

      await expect(service.login(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException when 2FA code is invalid', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        twoFactorEnabled: true,
        twoFactorSecret: 'secret',
      });
      (speakeasy.totp.verify as jest.Mock).mockReturnValue(false);

      await expect(
        service.login({ ...dto, twoFactorCode: '000000' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should succeed when valid 2FA code is provided', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        twoFactorEnabled: true,
        twoFactorSecret: 'secret',
      });
      (speakeasy.totp.verify as jest.Mock).mockReturnValue(true);
      prisma.session.create.mockResolvedValue({});

      const result = await service.login({ ...dto, twoFactorCode: '123456' });

      expect(result.tokens).toBeDefined();
    });

    it('should create a session on successful login', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.session.create.mockResolvedValue({});

      await service.login(dto);

      expect(prisma.session.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: mockUser.id,
            device: 'Login',
          }),
        }),
      );
    });
  });

  // ── refreshToken ──────────────────────────────────────────

  describe('refreshToken', () => {
    const validSession = {
      id: 'session-1',
      userId: 'user-1',
      token: 'old-refresh-token',
      expiresAt: new Date(Date.now() + 86400000),
    };

    it('should return new tokens for a valid session', async () => {
      prisma.session.findUnique.mockResolvedValue(validSession);
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.session.update.mockResolvedValue({});

      const result = await service.refreshToken('old-refresh-token');

      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
    });

    it('should update the session with new refresh token', async () => {
      prisma.session.findUnique.mockResolvedValue(validSession);
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.session.update.mockResolvedValue({});

      await service.refreshToken('old-refresh-token');

      expect(prisma.session.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: validSession.id },
          data: expect.objectContaining({ token: 'refresh-token' }),
        }),
      );
    });

    it('should throw UnauthorizedException when session not found', async () => {
      prisma.session.findUnique.mockResolvedValue(null);
      await expect(service.refreshToken('invalid')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw and delete session when expired', async () => {
      const expired = { ...validSession, expiresAt: new Date(Date.now() - 1000) };
      prisma.session.findUnique.mockResolvedValue(expired);
      prisma.session.delete.mockResolvedValue({});

      await expect(service.refreshToken('old-refresh-token')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(prisma.session.delete).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: expired.id } }),
      );
    });

    it('should throw UnauthorizedException when user not found', async () => {
      prisma.session.findUnique.mockResolvedValue(validSession);
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.refreshToken('old-refresh-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when user is soft-deleted', async () => {
      prisma.session.findUnique.mockResolvedValue(validSession);
      prisma.user.findUnique.mockResolvedValue({ ...mockUser, deletedAt: new Date() });
      await expect(service.refreshToken('old-refresh-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // ── resetPassword ─────────────────────────────────────────

  describe('resetPassword', () => {
    const dto = { token: 'valid-reset-token', password: 'newPassword123' };

    it('should hash the new password and update user', async () => {
      prisma.user.findFirst.mockResolvedValue(mockUser);
      prisma.$transaction.mockResolvedValue([{}, {}]);

      await service.resetPassword(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 12);
      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('should clear reset token and expiry', async () => {
      prisma.user.findFirst.mockResolvedValue(mockUser);
      prisma.$transaction.mockResolvedValue([{}, {}]);

      await service.resetPassword(dto);

      const transactionArg = prisma.$transaction.mock.calls[0][0];
      expect(transactionArg).toHaveLength(2);
    });

    it('should revoke all sessions for the user', async () => {
      prisma.user.findFirst.mockResolvedValue(mockUser);
      prisma.user.update.mockResolvedValue({});
      prisma.session.deleteMany.mockResolvedValue({ count: 3 });
      prisma.$transaction.mockResolvedValue([{}, { count: 3 }]);

      await service.resetPassword(dto);

      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid token', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      await expect(service.resetPassword(dto)).rejects.toThrow(BadRequestException);
    });
  });

  // ── setup2FA ──────────────────────────────────────────────

  describe('setup2FA', () => {
    it('should generate a TOTP secret and save it', async () => {
      const mockSecret = {
        base32: 'JBSWY3DPEHPK3PXP',
        otpauth_url: 'otpauth://totp/Downwork?secret=JBSWY3DPEHPK3PXP',
      };
      (speakeasy.generateSecret as jest.Mock).mockReturnValue(mockSecret);
      (QRCode.toDataURL as jest.Mock).mockResolvedValue('data:image/png;base64,qrdata');
      prisma.user.update.mockResolvedValue({});

      const result = await service.setup2FA('user-1');

      expect(speakeasy.generateSecret).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Downwork', length: 20 }),
      );
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-1' },
          data: { twoFactorSecret: mockSecret.base32 },
        }),
      );
      expect(result.qrCode).toBe('data:image/png;base64,qrdata');
    });

    it('should return only qrCode (not the secret)', async () => {
      (speakeasy.generateSecret as jest.Mock).mockReturnValue({
        base32: 'JBSWY3DPEHPK3PXP',
        otpauth_url: 'otpauth://totp/Downwork?secret=JBSWY3DPEHPK3PXP',
      });
      (QRCode.toDataURL as jest.Mock).mockResolvedValue('data:image/png;base64,qr');
      prisma.user.update.mockResolvedValue({});

      const result = await service.setup2FA('user-1');

      expect(result).toEqual({ qrCode: expect.any(String) });
      expect(result).not.toHaveProperty('secret');
      expect(result).not.toHaveProperty('base32');
    });
  });

  // ── deleteAccount ─────────────────────────────────────────

  describe('deleteAccount', () => {
    it('should soft delete the user and revoke sessions', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.$transaction.mockResolvedValue([{}, {}]);

      await service.deleteAccount('user-1', 'password123');

      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('should set deletedAt and deactivated status', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.user.update.mockResolvedValue({});
      prisma.session.deleteMany.mockResolvedValue({});
      prisma.$transaction.mockResolvedValue([{}, {}]);

      await service.deleteAccount('user-1', 'password123');

      const txArg = prisma.$transaction.mock.calls[0][0];
      expect(txArg).toHaveLength(2);
    });

    it('should throw NotFoundException when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.deleteAccount('user-1', 'pass')).rejects.toThrow();
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.deleteAccount('user-1', 'wrong')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});

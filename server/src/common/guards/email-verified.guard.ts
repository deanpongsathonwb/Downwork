import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

export const REQUIRE_EMAIL_VERIFIED = 'requireEmailVerified';

@Injectable()
export class EmailVerifiedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const requireVerified = this.reflector.getAllAndOverride<boolean>(REQUIRE_EMAIL_VERIFIED, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (requireVerified === false) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) return true;

    if (!user.isEmailVerified) {
      throw new ForbiddenException('Please verify your email address first');
    }

    return true;
  }
}

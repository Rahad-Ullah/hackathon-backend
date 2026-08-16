import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user || request.session?.user;

    if (!user) {
      throw new ForbiddenException('User session not found');
    }

    const userRole = user.role;

    if (!userRole || !requiredRoles.includes(userRole)) {
      throw new ForbiddenException(
        `User with role "${userRole ?? 'unknown'}" does not have required access rights`,
      );
    }

    return true;
  }
}

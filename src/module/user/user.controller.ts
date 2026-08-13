import { Controller, Get } from '@nestjs/common';
import { Session, AllowAnonymous, OptionalAuth } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';

@Controller('users')
export class UserController {
  @Get('me')
  async getProfile(@Session() session: UserSession) {
    return { user: session.user };
  }

  @Get('public')
  @AllowAnonymous()
  async getPublic() {
    return { message: 'Public endpoint accessible to anyone' };
  }

  @Get('optional')
  @OptionalAuth()
  async getOptional(@Session() session?: UserSession) {
    return {
      authenticated: !!session,
      user: session?.user ?? null,
    };
  }
}

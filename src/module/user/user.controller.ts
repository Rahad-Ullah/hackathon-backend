import { Controller, Get } from '@nestjs/common';
import { Session, AllowAnonymous, OptionalAuth } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

@Controller('users')
export class UserController {
  @Get('me')
  @ResponseMessage('User profile retrieved successfully')
  async getProfile(@Session() session: UserSession) {
    return { user: session.user };
  }

  @Get('public')
  @AllowAnonymous()
  @ResponseMessage('Public endpoint accessible to anyone')
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

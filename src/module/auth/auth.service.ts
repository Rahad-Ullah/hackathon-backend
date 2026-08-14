import { Injectable, Inject, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { BETTER_AUTH } from '../../lib/auth/auth.module';
import type { BetterAuthInstance } from '../../lib/auth/auth';
import { MailService } from '../../lib/mail/mail.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(BETTER_AUTH) private readonly auth: BetterAuthInstance,
    private readonly mailService: MailService,
  ) { }

  private getOptions(headers?: Headers) {
    return headers ? { headers } : {};
  }

  async signUp(dto: SignUpDto, headers?: Headers) {
    try {
      const response = await this.auth.api.signUpEmail({
        body: {
          email: dto.email,
          password: dto.password,
          name: dto.name,
          role: dto.role ?? 'participant',
        },
        returnHeaders: true,
        ...this.getOptions(headers),
      });

      return {
        data: {
          message: 'User registered successfully',
          ...response.response,
        },
        headers: response.headers,
      };
    } catch (error: any) {
      this.logger.error(`SignUp failed: ${error.message}`, error.stack);
      throw new BadRequestException(error.message || 'Registration failed');
    }
  }

  async signIn(dto: SignInDto, headers?: Headers) {
    try {
      const response = await this.auth.api.signInEmail({
        body: {
          email: dto.email,
          password: dto.password,
        },
        returnHeaders: true,
        ...this.getOptions(headers),
      });

      return {
        message: 'Login successful',
        data: response,
      };
    } catch (error: any) {
      this.logger.error(`SignIn failed: ${error.message}`, error.stack);
      throw new UnauthorizedException(error.message || 'Invalid email or password');
    }
  }

  async signOut(headers?: Headers) {
    try {
      const options = headers ? { headers } : undefined;
      await this.auth.api.signOut(options);
      return { message: 'Signed out successfully' };
    } catch (error: any) {
      this.logger.error(`SignOut failed: ${error.message}`, error.stack);
      throw new BadRequestException(error.message || 'Sign out failed');
    }
  }

  async verifyEmail(dto: VerifyEmailDto, headers?: Headers) {
    try {
      const response = await this.auth.api.verifyEmail({
        query: {
          token: dto.token,
        },
        ...this.getOptions(headers),
      });
      return {
        message: 'Email verified successfully',
        data: response,
      };
    } catch (error: any) {
      this.logger.error(`VerifyEmail failed: ${error.message}`, error.stack);
      throw new BadRequestException(error.message || 'Email verification failed');
    }
  }

  async forgetPassword(dto: ForgetPasswordDto, headers?: Headers) {
    try {
      const response = await this.auth.api.requestPasswordReset({
        body: {
          email: dto.email,
          redirectTo: dto.redirectTo,
        },
        ...this.getOptions(headers),
      });
      return {
        message: 'Password reset email requested',
        data: response,
      };
    } catch (error: any) {
      this.logger.error(`ForgetPassword failed: ${error.message}`, error.stack);
      throw new BadRequestException(error.message || 'Password reset request failed');
    }
  }

  async resetPassword(dto: ResetPasswordDto, headers?: Headers) {
    try {
      const response = await this.auth.api.resetPassword({
        body: {
          newPassword: dto.newPassword,
          token: dto.token,
        },
        ...this.getOptions(headers),
      });
      return {
        message: 'Password reset successfully',
        data: response,
      };
    } catch (error: any) {
      this.logger.error(`ResetPassword failed: ${error.message}`, error.stack);
      throw new BadRequestException(error.message || 'Password reset failed');
    }
  }

  async getSession(headers?: Headers) {
    try {
      const options = headers ? { headers } : undefined;
      const session = await this.auth.api.getSession(options);
      return session;
    } catch (error: any) {
      this.logger.error(`GetSession failed: ${error.message}`, error.stack);
      throw new UnauthorizedException('Session invalid or expired');
    }
  }
}

import { Controller, Post, Get, Body, Req, Res, HttpCode, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AllowAnonymous, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResponseMessage } from 'src/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  private extractHeaders(req: Request): Headers {
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((v) => headers.append(key, v));
        } else {
          headers.append(key, value);
        }
      }
    });
    return headers;
  }

  private applyHeaders(res: Response, headers?: Headers) {
    if (headers) {
      headers.forEach((value, key) => {
        res.appendHeader(key, value);
      });
    }
  }

  @Post('sign-up')
  @AllowAnonymous()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('User registered successfully')
  async signUp(
    @Body() dto: SignUpDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signUp(dto, this.extractHeaders(req));
    this.applyHeaders(res, result.headers);
    return result.response;
  }

  @Post('login')
  @AllowAnonymous()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Login successful')
  async signIn(
    @Body() dto: SignInDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signIn(dto, this.extractHeaders(req));
    this.applyHeaders(res, result.headers);
    return result.response;
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Sign out successful')
  async signOut(@Req() req: Request) {
    return this.authService.signOut(this.extractHeaders(req));
  }

  @Post('verify-email')
  @AllowAnonymous()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Email verified successfully')
  async verifyEmail(@Body() dto: VerifyEmailDto, @Req() req: Request) {
    return this.authService.verifyEmail(dto, this.extractHeaders(req));
  }

  @Post('forget-password')
  @AllowAnonymous()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Forget password email sent successfully')
  async forgetPassword(@Body() dto: ForgetPasswordDto, @Req() req: Request) {
    return this.authService.forgetPassword(dto, this.extractHeaders(req));
  }

  @Post('reset-password')
  @AllowAnonymous()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Reset password successful')
  async resetPassword(@Body() dto: ResetPasswordDto, @Req() req: Request) {
    return this.authService.resetPassword(dto, this.extractHeaders(req));
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async me(@Session() session: UserSession) {
    return {
      user: session.user,
      session: session.session,
    };
  }
}

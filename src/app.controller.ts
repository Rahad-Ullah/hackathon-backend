import { Controller, Get, UseGuards } from '@nestjs/common';
import { ArcjetGuard } from '@arcjet/nest';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { AppService } from './app.service';

@Controller()
@UseGuards(ArcjetGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @AllowAnonymous()
  getHello(): string {
    return this.appService.getHello();
  }
}

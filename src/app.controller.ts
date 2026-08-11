import { Controller, Get, UseGuards } from '@nestjs/common';
import { ArcjetGuard } from '@arcjet/nest';
import { AppService } from './app.service';

@Controller()
@UseGuards(ArcjetGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

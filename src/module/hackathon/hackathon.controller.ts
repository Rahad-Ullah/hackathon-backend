import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AllowAnonymous, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { ResponseMessage, Roles, RolesGuard } from '../../common';
import { CreateHackathonDto, QueryHackathonDto, UpdateHackathonDto } from './dto';
import { HackathonService } from './hackathon.service';

@Controller('hackathons')
@UseGuards(RolesGuard)
export class HackathonController {
  constructor(private readonly hackathonService: HackathonService) {}

  @Post()
  @Roles('admin')
  @ResponseMessage('Hackathon created successfully')
  async create(
    @Session() session: UserSession,
    @Body() createHackathonDto: CreateHackathonDto,
  ) {
    return this.hackathonService.create(session.user.id, createHackathonDto);
  }

  @Get()
  @AllowAnonymous()
  @ResponseMessage('Hackathons retrieved successfully')
  async findAll(@Query() query: QueryHackathonDto) {
    return this.hackathonService.findAll(query);
  }

  @Get(':id')
  @AllowAnonymous()
  @ResponseMessage('Hackathon details retrieved successfully')
  async findOne(@Param('id') id: string) {
    return this.hackathonService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ResponseMessage('Hackathon updated successfully')
  async update(
    @Param('id') id: string,
    @Session() session: UserSession,
    @Body() updateHackathonDto: UpdateHackathonDto,
  ) {
    return this.hackathonService.update(
      id,
      session.user.id,
      (session.user as any).role ?? 'participant',
      updateHackathonDto,
    );
  }

  @Delete(':id')
  @Roles('admin')
  @ResponseMessage('Hackathon deleted successfully')
  async delete(@Param('id') id: string, @Session() session: UserSession) {
    return this.hackathonService.delete(
      id,
      session.user.id,
      (session.user as any).role ?? 'participant',
    );
  }
}

import { Global, Module } from '@nestjs/common';
import { ArcjetModule as NestArcjetModule, shield, detectBot, slidingWindow, ArcjetMode } from '@arcjet/nest';
import { ArcjetService } from './arcjet.service';

const rawMode = (process.env.ARCJET_MODE || 'LIVE').split('#')[0].trim().toUpperCase();
const mode: ArcjetMode = rawMode === 'DRY_RUN' ? 'DRY_RUN' : 'LIVE';

@Global()
@Module({
  imports: [
    NestArcjetModule.forRoot({
      isGlobal: true,
      key: process.env.ARCJET_KEY || '',
      rules: [
        shield({ mode }),
        detectBot({ mode, allow: ['CATEGORY:SEARCH_ENGINE'] }),
        slidingWindow({
          mode,
          interval: 10,
          max: 10,
        })
      ],
    }),
  ],
  providers: [ArcjetService],
  exports: [ArcjetService, NestArcjetModule],
})
export class ArcjetModule { }

import { Global, Module } from '@nestjs/common';
import { AuthModule as NestBetterAuthModule } from '@thallesp/nestjs-better-auth';
import { PrismaService } from '../database/prisma.service';
import { createAuth } from './auth';

export const BETTER_AUTH = 'BETTER_AUTH';

@Global()
@Module({
  imports: [
    NestBetterAuthModule.forRootAsync({
      useFactory: (prisma: PrismaService) => {
        const auth = createAuth(prisma);
        return { auth };
      },
      inject: [PrismaService],
    }),
  ],
  providers: [
    {
      provide: BETTER_AUTH,
      useFactory: (prisma: PrismaService) => createAuth(prisma),
      inject: [PrismaService],
    },
  ],
  exports: [NestBetterAuthModule, BETTER_AUTH],
})
export class AuthModule {}

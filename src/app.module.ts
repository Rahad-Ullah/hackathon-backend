import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArcjetModule } from './lib/arcjet/arcjet.module';
import { PrismaModule } from './lib/database/prisma.module';
import { MailModule } from './lib/mail/mail.module';
import { AuthModule } from './lib/auth/auth.module';
import { AuthFeatureModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { HackathonModule } from './module/hackathon/hackathon.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ArcjetModule,
    PrismaModule,
    MailModule,
    AuthModule,
    AuthFeatureModule,
    UserModule,
    HackathonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

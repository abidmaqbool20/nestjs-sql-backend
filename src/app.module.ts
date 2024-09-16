import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { LoggerModule } from './modules/global/logger/logger.module';
import { rateLimiterConfig } from './config/rate-limiter.config';
import { RateLimiterModule, RateLimiterGuard } from 'nestjs-rate-limiter';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { ResponseService } from './modules/global/response/response.service';
import { loadDatabaseModule } from './db/db-loader';
import { HelpersModule } from './modules/global/helper/helpers.module';
import { ResponseModule } from './modules/global/response/response.module';
import { MailModule } from './modules/global/mailer/mail.module';
import { NotificationsModule } from './modules/global/notifications/notifications.module';
import { EmailModule } from './modules/global/emails/email.module';

let DBModule = loadDatabaseModule();

@Module({
  imports: [
    DBModule,
    RateLimiterModule.register(rateLimiterConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    UsersModule,
    PermissionsModule,
    RolesModule,
    HelpersModule,
    ResponseModule,
    LoggerModule,
    MailModule,
    NotificationsModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RateLimiterGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AppService,
    ResponseService
  ],
  exports: [],
})
export class AppModule {}

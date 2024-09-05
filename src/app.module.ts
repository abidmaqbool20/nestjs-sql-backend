import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';


import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { LoggerModule } from './logger/logger.module';
import { rateLimiterConfig } from '@/config/rate-limiter.config';
import { RateLimiterModule, RateLimiterGuard } from 'nestjs-rate-limiter';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { CacheService } from '@/cache/node.cache';
import { ResponseService } from '@/global/response.service';
import { loadDatabaseModule } from '@/db/db-loader';

let DBModule = loadDatabaseModule();

@Module({
  imports: [
    DBModule,
    RateLimiterModule.register(rateLimiterConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    UsersModule,
    LoggerModule,
    PermissionsModule,
    RolesModule,
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
    CacheService,
    ResponseService
  ],
  exports: [CacheService],
})
export class AppModule {}

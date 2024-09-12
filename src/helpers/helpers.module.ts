import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneralHelper } from './general.helper.service';
import { LoggerModule } from '../logger/logger.module';
import { CacheService } from '../cache/node.cache';
import { AppPermissionsGuard } from '../modules/auth/permissions.guard';
import { ResponseService } from '../global/response.service';
import { AuthModule } from '../modules/auth/auth.module';
import { RedisModule } from '../cache/redis.module';

@Module({
  imports: [
    LoggerModule,
    RedisModule,
    forwardRef(() => AuthModule),
  ],
  providers: [
    GeneralHelper,
    CacheService,
    ResponseService,
    AppPermissionsGuard
  ],
  controllers: [],
  exports: [GeneralHelper],
})
export class HelpersModule {}

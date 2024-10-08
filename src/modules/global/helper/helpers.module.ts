import { Module, forwardRef, Global  } from '@nestjs/common';
import { GeneralHelper } from './general.helper.service';
import { LoggerModule } from '../logger/logger.module';
import { CacheService } from '../cache/node.cache';
import { AppPermissionsGuard } from '../../auth/permissions.guard';
import { ResponseService } from '../response/response.service';
import { AuthModule } from '../../auth/auth.module';
import { RedisModule } from '../cache/redis.module';
import { MailService } from '../mailer/mail.service';
@Global()
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
    AppPermissionsGuard,
    MailService
  ],
  controllers: [],
  exports: [GeneralHelper],
})
export class HelpersModule {}

import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { Permission } from './entities/permission.entity';
import { PermissionsRepository } from './permissions.repository';
import { LoggerModule } from '@/logger/logger.module';
import { CacheService } from '@/cache/node.cache';
import { AppPermissionsGuard } from '@/modules/auth/permissions.guard';
import { ResponseService } from '@/global/response.service';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission]),
    LoggerModule,
    forwardRef(() => AuthModule),
  ],
  providers: [
    PermissionsService,
    PermissionsRepository,
    CacheService,
    ResponseService,
    Permission,
    AppPermissionsGuard
  ],
  controllers: [PermissionsController],
  exports: [PermissionsService, PermissionsRepository],
})
export class PermissionsModule {}

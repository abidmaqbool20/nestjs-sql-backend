import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { Permission } from './entities/permission.entity';
import { PermissionsRepository } from './permissions.repository';
import { LoggerModule } from '../global/logger/logger.module';
import { AppPermissionsGuard } from '../auth/permissions.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission]),
    LoggerModule,
    forwardRef(() => AuthModule),
  ],
  providers: [
    PermissionsService,
    PermissionsRepository,
    Permission,
    AppPermissionsGuard
  ],
  controllers: [PermissionsController],
  exports: [PermissionsService, PermissionsRepository],
})
export class PermissionsModule {}

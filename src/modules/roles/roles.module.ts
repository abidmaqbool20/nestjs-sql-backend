import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './entities/role.entity';
import { RolesRepository } from './roles.repository';
import { LoggerModule } from '@/logger/logger.module';
import { PermissionsModule } from '@/modules/permissions/permissions.module';
import { CacheService } from '@/cache/node.cache';
import { ResponseService } from '@/global/response.service';
import { AppPermissionsGuard } from '@/modules/auth/permissions.guard';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    LoggerModule,
    PermissionsModule,
    forwardRef(() => AuthModule), // Import AuthModule to provide JwtService
  ],
  providers: [
    RolesService,
    RolesRepository,
    CacheService,
    ResponseService,
    AppPermissionsGuard,
  ],
  controllers: [RolesController],
  exports: [RolesService, RolesRepository],
})
export class RolesModule {}

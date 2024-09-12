import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './entities/role.entity';
import { RolesRepository } from './roles.repository';
import { LoggerModule } from '../../logger/logger.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { AppPermissionsGuard } from '../auth/permissions.guard';
import { AuthModule } from '../auth/auth.module';
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
    AppPermissionsGuard,
  ],
  controllers: [RolesController],
  exports: [RolesService, RolesRepository],
})
export class RolesModule {}

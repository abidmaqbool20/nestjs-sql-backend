// users.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { LoggerModule } from '../global/logger/logger.module';
import { RolesModule } from '../roles/roles.module';
import { AppPermissionsGuard } from '../auth/permissions.guard';
import { AuthModule } from '../auth/auth.module';
import { Permission } from '../permissions/entities/permission.entity';
import { Role } from '../roles/entities/role.entity';  // Ensure Role is imported here

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),  // Ensure Role is here
    LoggerModule,
    forwardRef(() => AuthModule),  // Correctly handle circular dependencies
    RolesModule
  ],
  providers: [
    UsersService,
    UsersRepository,  // UsersRepository will have RoleModel injected via @InjectRepository
    AppPermissionsGuard,
  ],
  controllers: [UsersController],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}

import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { LoggerModule } from '../../global/logger/logger.module';
import { AppPermissionsGuard } from '../auth/permissions.guard';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    LoggerModule,
    forwardRef(() => AuthModule), // Correctly handle circular dependencies
  ],
  providers: [
    UsersService,
    UsersRepository,
    AppPermissionsGuard,
  ],
  controllers: [UsersController],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}

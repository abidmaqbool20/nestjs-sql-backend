import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { LoggerModule } from '../../logger/logger.module';
import { CacheService } from '../../cache/node.cache';
import { ResponseService } from '../../global/response.service';
import { AppPermissionsGuard } from '../auth/permissions.guard';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from '../../cache/redis.module';
import { HelpersModule } from '../../helpers/helpers.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    LoggerModule,
    RedisModule,
    HelpersModule,
    forwardRef(() => AuthModule), // Correctly handle circular dependencies
  ],
  providers: [
    UsersService,
    UsersRepository,
    CacheService,
    ResponseService,
    AppPermissionsGuard,
  ],
  controllers: [UsersController],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}

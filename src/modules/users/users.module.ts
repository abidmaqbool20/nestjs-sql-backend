import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { LoggerModule } from '@/logger/logger.module';
import { CacheService } from '@/cache/node.cache';
import { ResponseService } from '@/global/response.service';
import { AppPermissionsGuard } from '@/modules/auth/permissions.guard';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    LoggerModule,
    forwardRef(() => AuthModule), // Correctly handle circular dependencies
  ],
  providers: [
    UsersService,
    UsersRepository,
    CacheService,
    ResponseService,
    AppPermissionsGuard, // The guard can now resolve JwtService
  ],
  controllers: [UsersController],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}

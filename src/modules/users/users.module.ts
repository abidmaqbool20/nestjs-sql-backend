import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository'; 
import { LoggerModule } from '@/logger/logger.module';
import { CacheService } from '@/cache/node.cache';
import { ResponseService } from '@/global/response.service';
import { CacheKeysService } from '@/global/cache-keys.service'; 
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),  
    LoggerModule 
  ],
  providers: [
    UsersService,
    UsersRepository, 
    CacheService,
    ResponseService,
    {
      provide: CacheKeysService,
      useFactory: () => new CacheKeysService('users'),
    },
    User
  ],
  controllers: [UsersController],
  exports: [UsersService, UsersRepository], 
})
export class UsersModule {}

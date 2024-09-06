import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';
import { CustomLoggerService } from '../../logger/logger.service';
import { AuthRepository } from './auth.repository';
import { CacheService } from '../../cache/node.cache';
import { LoggerModule } from '../../logger/logger.module';
import { TokenService } from './token.service';
import { ResponseService } from '../../global/response.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { RedisModule } from '../../cache/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    LoggerModule,
    RedisModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'aY1le56893WRjtAQyzMemUUq3RfreGYJY1iL',
      signOptions: { algorithm :  'HS256', expiresIn: process.env.JWT_TOKEN_EXPIRE_TIME || '1h'  },
    }),
    forwardRef(() => UsersModule),

  ],
  providers: [
    AuthService,
    JwtStrategy,
    UsersService,
    UsersRepository,
    CustomLoggerService,
    AuthRepository,
    CacheService,
    TokenService,
    ResponseService,
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],  // Export JwtModule to make JwtService available
})
export class AuthModule {}

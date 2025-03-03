import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';
import { RolesRepository } from '../roles/roles.repository';
import { AuthRepository } from './auth.repository';
import { TokenService } from './token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { PermissionsService } from '../permissions/permissions.service';
import { Permission } from '../permissions/entities/permission.entity';
import { PermissionsRepository } from '../permissions/permissions.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([User,Role,Permission]),
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
    PermissionsRepository,
    PermissionsService,
    RolesRepository,
    AuthRepository,
    TokenService,
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],  // Export JwtModule to make JwtService available
})
export class AuthModule {}

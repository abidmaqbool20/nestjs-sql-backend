import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './jwt-payload.interface';
import { GeneralHelper } from '../global/helper/general.helper.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { CustomLoggerService } from '../global/logger/logger.service';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenService } from './token.service';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
config();

@Injectable()
export class AuthRepository {


  constructor(
    private readonly helper:GeneralHelper,
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly logger: CustomLoggerService,
    @InjectRepository(User)
    private readonly UserDBRepository: Repository<User>,
  ) {}


  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.UserDBRepository.findOne({
      where: { email: username },
      relations: ['roles', 'roles.permissions'],
    });

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(data: LoginDto) {
    const user = await this.validateUser(data.username, data.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const roles = user.roles;

    const payload: JwtPayload = {
      username: user.email,
      sub: user.id.toString(),
      roles,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: process.env.JWT_TOKEN_EXPIRE_TIME || '1h',
      }),
    };
  }

  async register(data: RegisterUserDto) {
    const hashedPassword = await GeneralHelper.encrypt(data.password, 'bcrypt');

    const newUser = this.UserDBRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await this.UserDBRepository.save(newUser);
    await this.helper.delCache([`users-findAll`]);
    return newUser;
  }

  async logout(token: string): Promise<boolean> {
    this.tokenService.addTokenToBlacklist(token);
    return true;
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { GeneralHelper } from '../../helpers/general.helper.service'
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { AuthRepository } from './auth.repository';
@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
  ) {}

  async login(data: LoginDto) {
    return this.authRepository.login(data);
  }

  async register(data: RegisterUserDto) {
    return this.authRepository.register(data);
  }

  async logout(token : string, data : any) {
    return this.authRepository.logout(token);
  }



}

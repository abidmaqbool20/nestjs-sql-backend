import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GeneralHelper } from '../global/helper/general.helper.service'
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly helper: GeneralHelper,
  ) {}

  async login(data: LoginDto) {
    let result = this.authRepository.login(data);
    if(result){
      let parameters = {
        to: 'abidmaqbool20@gmail.com',
        template: 'welcome',
        data: {text : 'You have logged in to the application. ', name: 'Abid'},
        subject: 'Login Successfulll. ',
      };
      let sent = this.helper.sendMail(parameters);
      if(sent){
        console.log("Login email sent successfully");
      }else{
        console.log("Login email not sent.");
      }
    }
    return result;
  }

  async register(data: RegisterUserDto) {
    return this.authRepository.register(data);
  }

  async logout(token : string, data : any) {
    return this.authRepository.logout(token);
  }



}

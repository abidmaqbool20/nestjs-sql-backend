import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {GeneralHelper} from '../../global/helper/general.helper.service'
import { config } from 'dotenv';
config();

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const unprotectedRoutes = await GeneralHelper.unprotectedRoutes();
    if (unprotectedRoutes.includes(request.url)) {
      return true;
    }
    return super.canActivate(context) as boolean;
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
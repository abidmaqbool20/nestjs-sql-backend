import { Body, Controller, Post, ValidationPipe, UsePipes, UseGuards, Req, Res, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ResponseService } from '../global/response/response.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseService: ResponseService
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 201, description: 'Login user.', type: LoginDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: LoginDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body(new ValidationPipe({ transform: true, whitelist: true })) data: LoginDto) {
    return this.authService.login(data);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register' })
  @ApiResponse({ status: 201, description: 'Register a new user.', type: LoginDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: RegisterUserDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body(new ValidationPipe({ transform: true, whitelist: true })) data: RegisterUserDto) {
    return this.authService.register(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 201, description: 'Logout user.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async logout(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const token = req.headers.authorization?.split(' ')[1];
    let logout = await this.authService.logout(token, res);
    let message = 'Logout Unsuccessful';

    res.status(HttpStatus.BAD_REQUEST);
    if (logout) {
      res.status(HttpStatus.OK);
      message = 'Logout successful';
    }
    return this.responseService.sendResponse(res, message);
  }
}

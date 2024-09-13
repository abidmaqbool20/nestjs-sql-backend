import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { AuthRepository } from './auth.repository';
import { TokenService } from './token.service';
import { FastifyRequest } from 'fastify'; // Import FastifyRequest
import { config } from 'dotenv';

config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'aY1le56893WRjtAQyzMemUUq3RfreGYJY1iL',
      passReqToCallback: true, // This will pass the request to the validate method
    });
  }

  async validate(request: FastifyRequest, payload: JwtPayload) { // Use FastifyRequest
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    // Check if the token is blacklisted
    const isBlacklisted = await this.tokenService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      throw new UnauthorizedException('Invalid token');
    }

    // Return the payload containing user information
    return payload;
  }
}

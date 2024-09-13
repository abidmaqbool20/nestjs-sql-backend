import { Injectable } from '@nestjs/common';
import { CacheService } from '../global/cache/node.cache';
import { config } from 'dotenv';
config();

@Injectable()
export class TokenService {
  private readonly blacklistedTokens: Set<string> = new Set();
  private readonly cacheService: CacheService

  addTokenToBlacklist(token: string) {
    this.blacklistedTokens.add(token);
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }
}

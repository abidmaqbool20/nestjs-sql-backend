import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { CacheService } from './node.cache';
@Global()
@Module({
  providers: [RedisService, CacheService],
  exports: [RedisService, CacheService], // Make sure to export RedisService
})
export class RedisModule {}

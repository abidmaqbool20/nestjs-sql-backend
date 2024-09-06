import { Injectable, OnModuleInit } from '@nestjs/common';
import { Permission } from './entities/permission.entity';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { PermissionsRepository } from './permissions.repository';
import { RedisService } from '../../cache/redis.service';

@Injectable()
export class PermissionsService implements OnModuleInit {

  public readonly module = "permissions";
  private readonly cacheDuration = 36000;

  constructor(
    private readonly repository: PermissionsRepository,
    private readonly redisService: RedisService,
  ) {}

  async onModuleInit() {
    // Initialization if needed
  }

  // Create a record
  async create(data: CreateDto): Promise<Permission> {
    const created = await this.repository.create(data);
    if (created) {
      const cacheKey = `${this.module}-findAll`;
      await this.redisService.getClient().del(cacheKey); // Clear cache
    }
    return created;
  }

  // Fetch all listings
  async findAll(): Promise<Permission[]> {
    const cacheKey = `${this.module}-findAll`;
    let result = await this.redisService.getJsonValue<Permission[]>(cacheKey);
    if (!result) {
      result = await this.repository.findAll();
      await this.redisService.setJsonValue(cacheKey, result, this.cacheDuration); // Set cache with expiry
    }
    return result;
  }

  // Find Single Record
  async findOne(id: bigint): Promise<Permission> {
    const cacheKey = `${this.module}-findOne-${id}`;
    let result = await this.redisService.getJsonValue<Permission>(cacheKey);
    if (!result) {
      result = await this.repository.findOne(id);
      await this.redisService.setJsonValue(cacheKey, result, this.cacheDuration); // Set cache with expiry
    }
    return result;
  }

  // Find by name
  async findByName(name: string): Promise<Permission> {
    const cacheKey = `${this.module}-findByName-${name}`;
    let result = await this.redisService.getJsonValue<Permission>(cacheKey);
    if (!result) {
      result = await this.repository.findByName(name);
      await this.redisService.setJsonValue(cacheKey, result, this.cacheDuration); // Set cache with expiry
    }
    return result;
  }

  // Find by ids
  async findByIds(ids: string[]): Promise<Permission[]> {
    const cacheKey = `${this.module}-findByIds`;
    let result = await this.redisService.getJsonValue<Permission[]>(cacheKey);
    if (!result) {
      result = await this.repository.findByIds(ids);
      await this.redisService.setJsonValue(cacheKey, result, this.cacheDuration); // Set cache with expiry
    }
    return result;
  }

  // Update record
  async update(id: bigint, userData: UpdateDto): Promise<Permission> {
    const result = await this.repository.update(id, userData);
    const cacheKey = `${this.module}-findAll`;
    await this.redisService.getClient().del(cacheKey);

    const findOneCacheKey = `${this.module}-findOne-${id}`;
    await this.redisService.getClient().del(findOneCacheKey);

    return result;
  }

  // Delete a record
  async remove(id: bigint): Promise<boolean> {
    const cacheKey = `${this.module}-findOne-${id}`;
    const result = await this.repository.remove(id);
    await this.redisService.getClient().del(cacheKey);
    return result ? true : false;
  }
}

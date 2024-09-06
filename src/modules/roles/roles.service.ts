import { Injectable, OnModuleInit } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { RolesRepository } from './roles.repository';
import { RedisService } from '../../cache/redis.service';

@Injectable()
export class RolesService implements OnModuleInit {
  private readonly module = 'roles';
  private readonly cacheDuration = 36000;

  constructor(
    private readonly repository: RolesRepository,
    private readonly redisService: RedisService,
  ) {}

  async onModuleInit() {
    // Initialization if needed
  }

  // Create a record
  async create(data: CreateDto): Promise<Role> {
    const cacheKey = `${this.module}-findAll`;
    const result = await this.repository.create(data);
    if (result) {
      await this.redisService.getClient().del(cacheKey);
    }
    return result;
  }

  // Fetch all listings
  async findAll(): Promise<Role[]> {
    const cacheKey = `${this.module}-findAll`;
    let result = await this.redisService.getJsonValue<Role[]>(cacheKey);
    if (!result) {
      result = await this.repository.findAll();
      await this.redisService.setJsonValue(cacheKey, result, this.cacheDuration);
    }
    return result;
  }

  // Find Single Record
  async findOne(id: bigint): Promise<Role> {
    const cacheKey = `${this.module}-findOne-${id}`;
    let result = await this.redisService.getJsonValue<Role>(cacheKey);
    if (!result) {
      result = await this.repository.findOne(id);
      await this.redisService.setJsonValue(cacheKey, result, this.cacheDuration);
    }
    return result;
  }

  // Find by Name
  async findByName(name: string): Promise<Role> {
    const cacheKey = `${this.module}-findByName-${name}`;
    let result = await this.redisService.getJsonValue<Role>(cacheKey);
    if (!result) {
      result = await this.repository.findByName(name);
      await this.redisService.setJsonValue(cacheKey, result, this.cacheDuration);
    }
    return result;
  }

  // Update record
  async update(id: bigint, userData: UpdateDto): Promise<Role> {
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

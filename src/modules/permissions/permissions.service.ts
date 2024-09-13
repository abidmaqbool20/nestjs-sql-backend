import { Injectable, OnModuleInit } from '@nestjs/common';
import { Permission } from './entities/permission.entity';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { PermissionsRepository } from './permissions.repository';
import { RedisService } from '../global/cache/redis.service';
import { GeneralHelper } from '../global/helper/general.helper.service';

@Injectable()
export class PermissionsService implements OnModuleInit {

  public readonly module = "permissions";
  private readonly cacheDuration = 36000;
  constructor(
    private readonly repository: PermissionsRepository,
    private readonly redisService: RedisService,
    private readonly helper: GeneralHelper,
  ) {}

  async onModuleInit() {
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
    let result = await this.helper.getCache<Permission[]>(cacheKey);
    if (!result) {
      result = await this.repository.findAll();
      await  this.helper.doCache(cacheKey, result, this.cacheDuration);
    }
    return result;
  }

  // Find Single Record
  async findOne(id: bigint): Promise<Permission> {
    const cacheKey = `${this.module}-findOne-${id}`;
    let result = await this.helper.getCache<Permission>(cacheKey);
    if (!result) {
      result = await this.repository.findOne(id);
      await  this.helper.doCache(cacheKey, result, this.cacheDuration);
    }
    return result;
  }

  // Find by name
  async findByName(name: string): Promise<Permission> {
    const cacheKey = `${this.module}-findByName-${name}`;
    let result = await this.helper.getCache<Permission>(cacheKey);
    if (!result) {
      result = await this.repository.findByName(name);
      await  this.helper.doCache(cacheKey, result, this.cacheDuration);
    }
    return result;
  }

  // Find by ids
  async findByIds(ids: string[]): Promise<Permission[]> {
    const cacheKey = `${this.module}-findByIds`;
    let result = await this.helper.getCache<Permission[]>(cacheKey);
    if (!result) {
      result = await this.repository.findByIds(ids);
      await this.helper.doCache(cacheKey, result, this.cacheDuration);
    }
    return result;
  }

  // Update record
  async update(id: bigint, userData: UpdateDto): Promise<Permission> {
    const result = await this.repository.update(id, userData);
    await this.helper.delCache([`${this.module}-findAll`, `${this.module}-findOne-${id}`]);
    return result;
  }

  // Delete a record
  async remove(id: bigint): Promise<boolean> {
    let status = false;
    let rec = await this.findOne(id);
    const result = await this.repository.remove(id);
    status = result ? true : false;
    if(status){
      await this.helper.delCache([`${this.module}-findOne-${id}`,`${this.module}-findByIds`,`${this.module}-findAll`,`${this.module}-findByName-${rec.name}`]);
    }

    return status;
  }
}

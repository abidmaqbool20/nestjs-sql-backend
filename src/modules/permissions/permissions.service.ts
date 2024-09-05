import { Injectable, OnModuleInit } from '@nestjs/common';
import { Permission } from './entities/permission.entity';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { PermissionsRepository } from './permissions.repository';
import { CacheService } from '@/cache/node.cache';
import { GeneralHelper } from '@/helpers/general.helper';

@Injectable()
export class PermissionsService implements OnModuleInit {

  public readonly module = "permissions";
  constructor(
    private readonly repository: PermissionsRepository,
    private readonly cacheService: CacheService
  ) {}

  async onModuleInit() {
    // Initialization if needed
  }

  //Create a record
  async create(data: CreateDto): Promise<Boolean> {
    let created = await this.repository.create(data);
    if(created){
      const cacheKey = this.module+"-findAll";
      this.cacheService.del(cacheKey);
    }
    return created ? true : false;
  }

  //Fetch all listings
  async findAll() : Promise<Permission[]>{
    const cacheKey = this.module+"-findAll";
    if (!this.cacheService.has(cacheKey)) {
      let result = await this.repository.findAll();
      this.cacheService.set(cacheKey, result, 36000);
    }
    return this.cacheService.get(cacheKey);
  }

  //Find Single Record
  async findOne(id: bigint): Promise<Permission> {
    const cacheKey = this.module+"-findByName-"+id;
    if (!this.cacheService.has(cacheKey)) {
      let result = await this.repository.findOne(id);
      this.cacheService.set(cacheKey, result, 36000);
    }
    return this.cacheService.get(cacheKey);
  }

  //Find by name
  async findByName(name: string): Promise<Permission> {
    const cacheKey = this.module+"-findByName-"+name;
    if (!this.cacheService.has(cacheKey)) {
      let result = await this.repository.findByName(name);
      this.cacheService.set(cacheKey, result, 36000);
    }
    return this.cacheService.get(cacheKey);
  }

  //Find by name
  async findByIds(ids: String[]): Promise<Permission[]> {
    const cacheKey = this.module+"-findByIds";
    // if (!this.cacheService.has(cacheKey)) {
      let result = await this.repository.findByIds(ids);
      this.cacheService.set(cacheKey, result, 36000);
    // }
    return this.cacheService.get(cacheKey);
  }

  //Update record
  async update(id: bigint, userData: UpdateDto): Promise<Boolean> {
    let result = await this.repository.update(id, userData);
    const cacheKey = this.module+"-findAll";
    this.cacheService.del(cacheKey);

    const findOneCacheKey = this.module+"-findOne-"+id.toString();
    this.cacheService.del(findOneCacheKey);
    return result;
  }

  //Delete a record
  async remove(id: bigint): Promise<Boolean> {
    const cacheKey = this.module+"-findOne-"+id.toString();
    let result = await this.repository.remove(id);
    this.cacheService.del(cacheKey);
    return result;
  }
}

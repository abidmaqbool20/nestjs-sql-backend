import { Injectable, OnModuleInit } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { RolesRepository } from './roles.repository';
import { CacheService } from '@/cache/node.cache';
import { GeneralHelper } from '@/helpers/general.helper';

@Injectable()
export class RolesService implements OnModuleInit {
  private readonly module = 'roles';
  constructor(
    private readonly repository: RolesRepository,
    private readonly cacheService: CacheService
  ) {}

  async onModuleInit() {
    // Initialization if needed
  }


  //Create a record
  async create(data: CreateDto): Promise<Boolean> {
    const cacheKey = this.module+"-findAll";
    let result = await this.repository.create(data);
    if(result){
      this.cacheService.del(cacheKey);
    }
    return result ? true : false;
  }

  //Fetch all listings
  async findAll(): Promise<Role[]> {
    const cacheKey = this.module+"-findAll";
    if (!this.cacheService.has(cacheKey)) {
      let result = await this.repository.findAll();
      this.cacheService.set(cacheKey, result, 36000);
    }
    return this.cacheService.get(cacheKey);
  }

  //Find Single Record
  async findOne(id: bigint): Promise<Role> {
    const cacheKey = this.module+"-findOne-"+id;
    if (!this.cacheService.has(cacheKey)) {
      let result = await this.repository.findOne(id);
      this.cacheService.set(cacheKey, result, 36000);
    }
    return this.cacheService.get(cacheKey);
  }

  //Find by Name
  async findByName(name: string): Promise<Role> {
    const cacheKey = this.module+"-findByName-"+name;
    if (!this.cacheService.has(cacheKey)) {
      let result = await this.repository.findByName(name);
      this.cacheService.set(cacheKey, result, 36000);
    }
    return this.cacheService.get(cacheKey);
  }

  //Update record
  async update(id: bigint, userData: UpdateDto): Promise<Boolean> {
    let result = this.repository.update(id, userData);

    const cacheKey = this.module+"-findAll";
    this.cacheService.del(cacheKey);

    const findOneCacheKey = this.module+"-findOne-"+id.toString();
    this.cacheService.del(findOneCacheKey);

    return result ? true : false;

  }

  //Delete a record
  async remove(id: bigint): Promise<Boolean> {
    const cacheKey = this.module+"-findOne-"+id.toString();
    let result = this.repository.remove(id);
    this.cacheService.del(cacheKey);
    return result ? true : false;
  }
}

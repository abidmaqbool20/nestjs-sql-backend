import { Injectable, NotFoundException } from '@nestjs/common';
import { Permission } from './entities/permission.entity';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PermissionsRepository {
  constructor(
      @InjectRepository(Permission)
      private readonly PermissionModel: Repository<Permission>
  ) {}

  // Create a record
  async create(data: CreateDto): Promise<Permission> {
    const record = await Permission.newInstanceFromDTO(data);
    return this.PermissionModel.save(record);
  }

  // Fetch all listings
  async findAll(): Promise<Permission[]> {
    return this.PermissionModel.find();
  }

  // Find Single Record
  async findOne(id: bigint): Promise<Permission> {
    const record = await this.PermissionModel.findOneBy({ id });
    if (!record) {
      throw new NotFoundException('Record not found');
    }
    return record;
  }

  // Find by Username
  async findByName(name: string): Promise<Permission> {
    const record = await this.PermissionModel.findOneBy({ name: name });
    if (!record) {
      throw new NotFoundException('Record not found');
    }
    return record;
  }

  // Find by Username
  async findByIds(ids: String[]): Promise<Permission[]> {
    const record = await this.PermissionModel.find({
      where: { id: In(ids) },
    });
    if (!record) {
      throw new NotFoundException('Record not found');
    }
    return record;
  }



  // Update record
  async update(id: bigint, permissionData: UpdateDto): Promise<Permission> {
    let result = false;
    const record = await this.findOne(id);
    if (record) {
      let updated = await this.PermissionModel.update(id.toString(), permissionData);
      if (!updated) {
        throw new Error('Update failed');
      }
      return this.findOne(id);
    }

    throw new Error('Update failed');
  }

  // Delete a record
  async remove(id: bigint): Promise<Boolean> {
    let result = false;
    const record = await this.findOne(id);
    if (record) {
      let deleted = await this.PermissionModel.delete(id.toString());
      result = deleted ? true : false;
    }
    return result;
  }
}

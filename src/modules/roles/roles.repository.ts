import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionsService } from '../permissions/permissions.service';
@Injectable()
export class RolesRepository {
  constructor(
    @InjectRepository(Role)
    private readonly RoleModel: Repository<Role>,
    private readonly permissionService: PermissionsService
  ) {}

  // Get entity instance
  async createRoleFromDto(data: CreateDto): Promise<Role> {
    const role = new Role();
    role.name = data.name;

    if (data.permissions) {
      const permissionIds = data.permissions.map(id => String(id));
      role.permissions = await this.permissionService.findByIds(permissionIds);
    }

    return role;
  }

  // Create a record
  async create(data: CreateDto): Promise<Role> {
    const record = await this.createRoleFromDto(data);
    return this.RoleModel.save(record);
  }

  // Fetch all listings
  async findAll(): Promise<Role[]> {
    return this.RoleModel.find({relations :["permissions"]});
  }

  // Find Single Record
  async findOne(id: bigint): Promise<Role> {
    const record = await this.RoleModel.findOne({
      where: { id  },
      relations: ['permissions'],
    });
    if (!record) {
      throw new NotFoundException('Record not found');
    }
    return record;
  }

  // Find by Username
  async findByName(name: string): Promise<Role> {
    const record = await this.RoleModel.findOne({  where: { name : name }, relations: [ 'permissions']});
    if (!record) {
      throw new NotFoundException('Record not found');
    }
    return record;
  }

 // Update record
  async update(id: bigint, roleData: UpdateDto): Promise<Role> {
    const record = await this.findOne(id);
    if (!record) {
      throw new Error('Role not found');
    }

    if (roleData.permissions) {
      const permissionIds = roleData.permissions.map(id => String(id));
      record.permissions = await this.permissionService.findByIds(permissionIds);
    }

    // Perform the update operation
    const updateResult = await this.RoleModel.update(id.toString(), {
      name: roleData.name,
      permissions: record.permissions
    });

    // Ensure the update was successful
    if (!updateResult) {
      throw new Error('Update failed');
    }

    // Return the updated record
    return this.findOne(id);
  }


  // Delete a record
  async remove(id: bigint): Promise<Boolean> {
    let result = false;
    const record = await this.findOne(id);
    if (record) {
      let deleted = await this.RoleModel.delete(id.toString());
      result = deleted ? true : false;
    }
    return result;
  }
}

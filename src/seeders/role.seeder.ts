import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { In } from 'typeorm';
import { Role } from '../modules/roles/entities/role.entity';
import { Permission } from '../modules/permissions/entities/permission.entity';
import { buildDbConfig } from '../config/db.config';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
const dataSource = new DataSource(buildDbConfig(process.env) as DataSourceOptions);

export async function seed() {
  await dataSource.initialize();

  const roleRepository = dataSource.getRepository(Role);
  const permissionRepository = dataSource.getRepository(Permission);

  const rolesWithPermissions = [
    {
      name: 'Admin',
      permissions: [
        'create-user',
        'update-user',
        'delete-user',
        'view-user',
        'create-role',
        'update-role',
        'delete-role',
        'view-role',
        'create-permission',
        'update-permission',
        'delete-permission',
        'view-permission',
        'view-subscription',
        'update-subscription',
      ],
    },
    {
      name: 'Staff',
      permissions: [
        'create-user',
        'update-user',
        'delete-user',
        'view-user',
      ],
    },
    {
      name: 'Member',
      permissions: [
        'view-subscription',
        'update-subscription',
      ],
    },
  ];

  for (const roleData of rolesWithPermissions) {
    let role = await roleRepository.findOne({
      where: { name: roleData.name },
    });

    if (!role) {
      role = roleRepository.create({ name: roleData.name });
    }

    const permissions = await permissionRepository.find({
      where: { name: In(roleData.permissions) },
    });

    role.permissions = permissions;
    await roleRepository.save(role);
  }

  console.log('✅ Roles and permissions seeded successfully');

  await dataSource.destroy();
}

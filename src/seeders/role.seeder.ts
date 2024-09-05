import { createConnection, In } from 'typeorm';
import { Role } from '../modules/roles/entities/role.entity';
import { Permission } from '../modules/permissions/entities/permission.entity';
import { getDBConfig } from '../config/dbConfig';

export async function seed() {
  const connection = await createConnection(getDBConfig());
  const roleRepository = connection.getRepository(Role);
  const permissionRepository = connection.getRepository(Permission);

  // List of roles and their associated permissions
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
      permissions: [],
    },
  ];

  for (const roleData of rolesWithPermissions) {
    let role = await roleRepository.findOne({ where: { name: roleData.name } });

    if (!role) {
      // Create a new role if it doesn't exist
      role = new Role();
      role.name = roleData.name;
    }

    // Find permissions by name using the In operator
    const permissions = await permissionRepository.find({
      where: { name: In(roleData.permissions) },
    });

    role.permissions = permissions;

    // Save the role with its associated permissions
    await roleRepository.save(role);
  }

  console.log('Roles and permissions have been successfully saved!');
  await connection.close();
}
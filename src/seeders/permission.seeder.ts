import { createConnection } from 'typeorm';
import { Permission } from '../modules/permissions/entities/permission.entity';
import { getDBConfig } from '../config/dbConfig';


export async function seed() {
  const connection = await createConnection(getDBConfig());
  const repository = connection.getRepository(Permission); //This is the typeorm repository for the database table

    // List of roles to be upserted
    const permissions = [
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
    ];

    // Prepare role objects
    const entities = permissions.map(permission => {
        const obj = new Permission();
        obj.name = permission;
        return obj;
    });

    // Upsert roles
    await repository.upsert(entities, ['name']);

    console.log('Permissions have been upserted!');
    await connection.close();
}



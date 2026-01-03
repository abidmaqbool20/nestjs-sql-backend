import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Permission } from '../modules/permissions/entities/permission.entity';
import { buildDbConfig } from '../config/db.config';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
const dataSource = new DataSource(buildDbConfig(process.env) as DataSourceOptions);

export async function seed() {
    await dataSource.initialize();
    const repository = dataSource.getRepository(Permission); //This is the typeorm repository for the database table

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
        'view-subscription',
        'update-subscription',
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
    await dataSource.destroy();
}



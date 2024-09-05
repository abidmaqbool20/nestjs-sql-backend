import {seed as RoleSeeder} from './role.seeder'
import {seed as PermissionSeeder} from './permission.seeder'
import {seed as UserSeeder} from './user.seeder'

async function runSeeder(){
    //execute the seeders in hirarchy
    PermissionSeeder();
    RoleSeeder();
    UserSeeder()
}

runSeeder().catch(err => {
    console.error('Error seeding data:', err);
    process.exit(1);
});
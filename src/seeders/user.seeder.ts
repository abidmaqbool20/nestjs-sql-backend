import { createConnection, In } from 'typeorm';
import { Role } from '../modules/roles/entities/role.entity';
import { User } from '../modules/users/entities/user.entity';
import { getDBConfig } from '../config/dbConfig';
import {GeneralHelper} from '../helpers/general.helper.service'
export async function seed() {
  const connection = await createConnection(getDBConfig());
  const userRepository = connection.getRepository(User);
  const roleRepository = connection.getRepository(Role);

  // List of roles and their associated permissions
  const usersWithRoles = [
    {
      name: 'Admin',
      email: 'admin@gmail.com',
      password: '12345',
      roles: [
        'Admin',
      ],
    },
    {
      name: 'Staff',
      email: 'staff@gmail.com',
      password: '12345',
      roles: [
        'Staff',
      ],
    },
    {
      name: 'Member',
      email: 'member@gmail.com',
      password: '12345',
      roles: [
        'Member',
      ],
    },

  ];

  for (const userData of usersWithRoles) {
    let user = await userRepository.findOne({ where: { email: userData.email } });

    if (!user) {
      // Create a new user if it doesn't exist
      user = new User();
      user.name = userData.name;
      user.email = userData.email;
      user.password = await GeneralHelper.encrypt(userData.password);
    }else{
      user.name = userData.name;
      user.password = await GeneralHelper.encrypt(userData.password);
    }
    // Find roles by name using the In operator
    const roles = await roleRepository.find({
      where: { name: In(userData.roles) },
    });

    user.roles = roles;

    // Save the user with its associated roles
    await userRepository.save(user);
  }

  console.log('User and roles have been successfully saved!');
  await connection.close();
}
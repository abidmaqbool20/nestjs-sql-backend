import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesService } from '../roles/roles.service';
import { ResponseService } from '../global/response/response.service';
import { CustomLoggerService } from '../global/logger/logger.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersModule } from '../users/users.module';
import { Role } from '../roles/entities/role.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let rolesService: RolesService;
  let responseService: ResponseService;
  let logger: CustomLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        TypeOrmModule.forFeature([User, Role]), // Ensure User and Role entities are included
        forwardRef(() => UsersModule),
      ],
      controllers: [UsersController],
      providers: [UsersService, RolesService, ResponseService, CustomLoggerService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    rolesService = module.get<RolesService>(RolesService);
    responseService = module.get<ResponseService>(ResponseService);
    logger = module.get<CustomLoggerService>(CustomLoggerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe('create', () => {
  //   it('should successfully create a user', async () => {
  //     const createUserDto = {
  //       name: 'John Doe',
  //       email: 'john@example.com',
  //       password: 'secret123',
  //       created_at: new Date(),
  //       updated_at: new Date(),
  //       roles: [
  //         {
  //           id: BigInt(1),
  //           name: 'Admin',
  //           permissions: [{ id: BigInt(1), name: 'Create User' }]
  //         }
  //       ],
  //     };

  //     const result = {
  //       id: BigInt(1),
  //       ...createUserDto,
  //     };

  //     jest.spyOn(service, 'create').mockResolvedValue(result);
  //     jest.spyOn(responseService, 'sendResponse').mockImplementation((res, message, data) => {
  //       return data;
  //     });

  //     const mockReply = {
  //       status: jest.fn().mockReturnThis(),
  //       send: jest.fn(), // Fastify uses send() instead of json()
  //     } as unknown as FastifyReply;

  //     const response = await controller.create(createUserDto, mockReply);

  //     expect(service.create).toHaveBeenCalledWith(createUserDto);
  //     expect(responseService.sendResponse).toHaveBeenCalledWith(mockReply, 'successful', result);
  //     expect(response).toEqual(result);
  //   });
  // });

  // describe('findAll', () => {
  //   it('should return all users', async () => {
  //     const users: User[] = [
  //       {
  //         id: BigInt(1),
  //         name: 'Test User',
  //         email: 'test@example.com',
  //         password: 'password123',
  //         created_at: new Date(),
  //         updated_at: new Date(),
  //         roles: [], // Ensure roles property is present
  //       },
  //     ];
  //     jest.spyOn(service, 'findAll').mockResolvedValue(users);

  //     const mockReply = {
  //       status: jest.fn().mockReturnThis(),
  //       send: jest.fn(), // Fastify uses send() instead of json()
  //     } as unknown as FastifyReply;

  //     await controller.findAll(mockReply);

  //     expect(service.findAll).toHaveBeenCalled();
  //     expect(responseService.sendResponse).toHaveBeenCalledWith(
  //       mockReply,
  //       'successful',
  //       users
  //     );
  //   });
  // });

  // describe('findOne', () => {
  //   it('should return a user by ID', async () => {
  //     const userId = BigInt(1);
  //     const user: User = {
  //       id: userId,
  //       name: 'Test User',
  //       email: 'test@example.com',
  //       password: 'password123',
  //       created_at: new Date(),
  //       updated_at: new Date(),
  //       roles: [], // Ensure roles property is present
  //     };
  //     jest.spyOn(service, 'findOne').mockResolvedValue(user);

  //     const mockReply = {
  //       status: jest.fn().mockReturnThis(),
  //       send: jest.fn(), // Fastify uses send() instead of json()
  //     } as unknown as FastifyReply;

  //     await controller.findOne(userId, mockReply);

  //     expect(service.findOne).toHaveBeenCalledWith(userId);
  //     expect(responseService.sendResponse).toHaveBeenCalledWith(
  //       mockReply,
  //       'successful',
  //       user
  //     );
  //   });
  // });

  // describe('update', () => {
  //   it('should update a user by ID', async () => {
  //     const userId = BigInt(1);
  //     const updateUserDto = {
  //       name: 'Updated User',
  //       email: 'updated@example.com',
  //       password: 'updated123',
  //       created_at: new Date(),
  //       updated_at: new Date(),
  //       roles:[]
  //     };
  //     const updatedUser: User = { id: userId, ...updateUserDto, roles: [] };

  //     jest.spyOn(service, 'update').mockResolvedValue(updatedUser);

  //     const mockReply = {
  //       status: jest.fn().mockReturnThis(),
  //       send: jest.fn(), // Fastify uses send() instead of json()
  //     } as unknown as FastifyReply;

  //     await controller.update(userId, updateUserDto, mockReply);

  //     expect(service.update).toHaveBeenCalledWith(userId, updateUserDto);
  //     expect(responseService.sendResponse).toHaveBeenCalledWith(
  //       mockReply,
  //       'successful',
  //       updatedUser
  //     );
  //   });
  // });

  // describe('remove', () => {
  //   it('should delete a user by ID', async () => {
  //     const userId = BigInt(1);
  //     const deleteResult = true; // Assuming `remove` returns a boolean indicating success

  //     jest.spyOn(service, 'remove').mockResolvedValue(deleteResult);

  //     const mockReply = {
  //       status: jest.fn().mockReturnThis(),
  //       send: jest.fn(), // Fastify uses send() instead of json()
  //     } as unknown as FastifyReply;

  //     await controller.remove({ id: userId }, mockReply);

  //     expect(service.remove).toHaveBeenCalledWith(userId);
  //     expect(responseService.sendResponse).toHaveBeenCalledWith(
  //       mockReply,
  //       'successful',
  //       deleteResult
  //     );
  //   });
  // });
});

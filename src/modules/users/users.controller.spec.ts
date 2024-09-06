import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateDto } from './dto/create.dto';
import { User } from './entities/user.entity';
import { ResponseService } from '../../global/response.service';
import { CustomLoggerService } from '../../logger/logger.service';
import { AuthModule } from '../auth/auth.module';
import { Response } from 'express';
import { DataSource } from 'typeorm';
import { AppTestDataSource } from '../../config/ormconfig.test';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let responseService: ResponseService;
  let logger: CustomLoggerService;
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = await AppTestDataSource.initialize();
    await dataSource.synchronize(true);

    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: ResponseService,
          useValue: {
            sendResponse: jest.fn(),
          },
        },
        {
          provide: CustomLoggerService,
          useValue: {
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    responseService = module.get<ResponseService>(ResponseService);
    logger = module.get<CustomLoggerService>(CustomLoggerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a user', async () => {

      const permissions = [
        {
          id: BigInt(1),
          name: 'create-user',
        },
        {
          id: BigInt(2),
          name: 'update-user',
        },
        {
          id: BigInt(3),
          name: 'view-user',
        },
        {
          id: BigInt(4),
          name: 'view-user',
        }
      ];



      const role = {
        id: BigInt(1),
        name: 'Admin',
        permissions: permissions
      };


      const createUserDto: CreateDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'secret123',
        created_at: new Date(),
        updated_at: new Date(),
        roles:[role],
      };

      const result: User = {
        id: BigInt(1),
        ...createUserDto,
      };

      jest.spyOn(service, 'create').mockResolvedValue(result);
      jest.spyOn(responseService, 'sendResponse').mockImplementation((res, message, data) => {
        return data;
      });

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const response = await controller.create(createUserDto, res);

      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(responseService.sendResponse).toHaveBeenCalledWith(res, 'successful', result);
      expect(response).toEqual(result); // Ensure the response matches the expected result
    });
  });

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

  //     const mockResponse = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn(),
  //     } as unknown as Response;

  //     await controller.findAll(mockResponse);

  //     expect(service.findAll).toHaveBeenCalled();
  //     expect(responseService.sendResponse).toHaveBeenCalledWith(
  //       mockResponse,
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

  //     const mockResponse = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn(),
  //     } as unknown as Response;

  //     await controller.findOne(userId, mockResponse);

  //     expect(service.findOne).toHaveBeenCalledWith(userId);
  //     expect(responseService.sendResponse).toHaveBeenCalledWith(
  //       mockResponse,
  //       'successful',
  //       user
  //     );
  //   });
  // });


  // describe('update', () => {
  //   it('should update a user by ID', async () => {
  //     const userId = BigInt(1);
  //     const updateUserDto: CreateDto = {
  //       name: 'Updated User',
  //       email: 'updated@example.com',
  //       password: 'updated123',
  //       created_at: new Date(),
  //       updated_at: new Date(),
  //     };
  //     const updatedUser: User = { id: userId, ...updateUserDto, roles: [] };

  //     jest.spyOn(service, 'update').mockResolvedValue(updatedUser);

  //     const mockResponse = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn(),
  //     } as unknown as Response;

  //     await controller.update(userId, updateUserDto, mockResponse);

  //     expect(service.update).toHaveBeenCalledWith(userId, updateUserDto);
  //     expect(responseService.sendResponse).toHaveBeenCalledWith(
  //       mockResponse,
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

  //     const mockResponse = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn(),
  //     } as unknown as Response;

  //     await controller.remove({ id: userId }, mockResponse);

  //     expect(service.remove).toHaveBeenCalledWith(userId);
  //     expect(responseService.sendResponse).toHaveBeenCalledWith(
  //       mockResponse,
  //       'successful',
  //       deleteResult
  //     );
  //   });
  // });

});

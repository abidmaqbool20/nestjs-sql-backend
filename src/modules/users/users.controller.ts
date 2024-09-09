import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Res ,HttpStatus, UsePipes, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { Request, Response } from 'express';
import { GetDto } from './dto/get.dto';
import { DeleteDto } from './dto/delete.dto';
import { User } from './entities/user.entity';
import { CustomLoggerService } from '../../logger/logger.service';
import { ResponseService } from '../..//global/response.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AppPermissionsGuard } from '../auth/permissions.guard';
import { AppPermissions } from '../auth/permissions.decorator';

@ApiTags('Users')
@UseGuards(JwtAuthGuard, AppPermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly moduleService: UsersService,
    private readonly responseService: ResponseService,
    private readonly logger: CustomLoggerService,
  ) {}

  @Post()
  @AppPermissions('create-user')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.', type: User })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: CreateDto })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body(new ValidationPipe({ transform: true, whitelist: true })) data: CreateDto, @Res() res: Response) {
    try {
      console.log(data);
      let result =  await this.moduleService.create(data);
      res.status(HttpStatus.BAD_REQUEST);
      let message = 'Unsuccessful. Error occurred!';
      if(result){
        res.status(HttpStatus.OK);
        message = 'successful';
      }
      return this.responseService.sendResponse(res,message,result);
    } catch (error) {
      this.logger.error(error, 'An error occurred while creating user');
      throw error;
    }
  }

  @Get()
  @AppPermissions('view-user')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users', type: [User] })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findAll(@Res() res: Response) {
    try {
      let result = await this.moduleService.findAll();
      res.status(HttpStatus.BAD_REQUEST);
      let message = 'Unsuccessful. Error occurred!';
      if(result){
        res.status(HttpStatus.OK);
        message = 'successful';
      }
      return this.responseService.sendResponse(res,message,result);
    } catch (error) {
      this.logger.error(error, 'An error occurred while fetching all users');
      throw error;
    }
  }

  @Get(':id')
  @AppPermissions('view-user')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async findOne(@Param('id') id: bigint, @Res() res: Response) {
    try {
      let result = await this.moduleService.findOne(id);
      res.status(HttpStatus.BAD_REQUEST);
      let message = 'Unsuccessful. Error occurred!';
      if(result){
        res.status(HttpStatus.OK);
        message = 'successful';
      }
      return this.responseService.sendResponse(res,message,result);
    } catch (error) {
      this.logger.error(error, `An error occurred while fetching user with id ${id}`);
      throw error;
    }
  }

  @Patch(':id')
  @AppPermissions('update-user')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiBody({ type: UpdateDto })
  @ApiResponse({ status: 200, description: 'User updated', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: bigint, @Body() data: UpdateDto, @Res() res: Response) {
    try {
      let result = await this.moduleService.update(id, data);
      res.status(HttpStatus.BAD_REQUEST);
      let message = 'Unsuccessful. Error occurred!';
      if(result){
        res.status(HttpStatus.OK);
        message = 'successful';
      }
      return this.responseService.sendResponse(res,message,result);
    } catch (error) {
      this.logger.error(error, `An error occurred while updating user with id ${id}`);
      throw error;
    }
  }

  @Delete(':id')
  @AppPermissions('delete-user')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number'})
  @ApiBody({ type: DeleteDto })
  @ApiResponse({ status: 204, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async remove(@Param() params: DeleteDto, @Res() res: Response) {
    const { id } = params;
    try {
      let result = await this.moduleService.remove(id);
      res.status(HttpStatus.BAD_REQUEST);
      let message = 'Unsuccessful. Error occurred!';
      if(result){
        res.status(HttpStatus.OK);
        message = 'successful';
      }
      return this.responseService.sendResponse(res,message,result);
    } catch (error) {
      this.logger.error(error, `An error occurred while deleting user with id ${id}`);
      throw error;
    }
  }
}

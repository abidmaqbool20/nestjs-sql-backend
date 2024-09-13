import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ValidationPipe, Res ,HttpStatus, UsePipes, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

import { PermissionsService } from './permissions.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { DeleteDto } from './dto/delete.dto';
import { Permission } from './entities/permission.entity';
import { Request, Response } from 'express';
import { CustomLoggerService } from '../../global/logger/logger.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResponseService } from '../../global/response/response.service';
import { AppPermissionsGuard } from '../auth/permissions.guard';
import { AppPermissions } from '../auth/permissions.decorator';

@ApiTags('Permissions')
@UseGuards(JwtAuthGuard,AppPermissionsGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(
    private readonly moduleService: PermissionsService,
    private readonly responseService: ResponseService,
    @Inject(CustomLoggerService) private readonly logger: CustomLoggerService,
  ) {}

  // Create API
  @Post()
  @AppPermissions('create-permission')
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiResponse({ status: 201, description: 'Permission has been successfully created.', type: Permission })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: CreateDto })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body(new ValidationPipe({ transform: true, whitelist: true })) data: CreateDto, @Res() res: Response) {
    try {
      let result = await this.moduleService.create(data);

      res.status(HttpStatus.BAD_REQUEST);
      let message = 'Unsuccessful. Error occurred!';
      if(result){
        res.status(HttpStatus.OK);
        message = 'successful';
      }
      return this.responseService.sendResponse(res,message,result);
    } catch (error) {
      this.logger.error(error, 'An error occurred while creating permission');
      throw error; // You can throw a more specific HttpException here.
    }
  }

  // Get Listings API
  @Get()
  @AppPermissions('view-permission')
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({ status: 200, description: 'List of permissions', type: [Permission] })
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
      this.logger.error(error, 'An error occurred while fetching all permissions');
      throw error;
    }
  }

  // Get single record
  @Get(':id')
  @AppPermissions('view-permission')
  @ApiOperation({ summary: 'Get a permission by ID' })
  @ApiParam({ name: 'id', description: 'Permission ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Permission found', type: Permission })
  @ApiResponse({ status: 404, description: 'Permission not found' })
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
      this.logger.error(error, `An error occurred while fetching permission with id ${id}`);
      throw error;
    }
  }

  // Update API
  @Patch(':id')
  @AppPermissions('update-permission')
  @ApiOperation({ summary: 'Update a permission by ID' })
  @ApiParam({ name: 'id', description: 'Permission ID', type: 'number' })
  @ApiBody({ type: UpdateDto })
  @ApiResponse({ status: 200, description: 'Permission updated', type: Permission })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: bigint, @Body() data: UpdateDto, @Res() res: Response) {
    try {
      let result =  await this.moduleService.update(id, data);

      res.status(HttpStatus.BAD_REQUEST);
      let message = 'Unsuccessful. Error occurred!';
      if(result){
        res.status(HttpStatus.OK);
        message = 'successful';
      }
      return this.responseService.sendResponse(res,message,result);
    } catch (error) {
      this.logger.error(error, `An error occurred while updating permission with id ${id}`);
      throw error;
    }
  }

  // Delete API
  @Delete(':id')
  @AppPermissions('delete-permission')
  @ApiOperation({ summary: 'Delete a permission by ID' })
  @ApiParam({ name: 'id', description: 'Permission ID', type: 'number' })
  @ApiBody({ type: DeleteDto })
  @ApiResponse({ status: 204, description: 'Permission deleted' })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async remove(@Param() params: DeleteDto, @Res() res: Response) {
    const { id } = params;
    try {
      let result =  await this.moduleService.remove(id);
      res.status(HttpStatus.BAD_REQUEST);
      let message = 'Unsuccessful. Error occurred!';
      if(result){
        res.status(HttpStatus.OK);
        message = 'successful';
      }
      return this.responseService.sendResponse(res,message,result);


    } catch (error) {
      this.logger.error(error, `An error occurred while deleting permission with id ${id}`);
      throw error;
    }
  }
}

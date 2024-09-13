import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Inject,  Res,HttpStatus, ValidationPipe, UsePipes, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

import { RolesService } from './roles.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { GetDto } from './dto/get.dto';
import { DeleteDto } from './dto/delete.dto';
import { Request, Response } from 'express';
import { Role } from './entities/role.entity';
import { CustomLoggerService } from '../../global/logger/logger.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResponseService } from '../../global/response/response.service';
import { AppPermissionsGuard } from '../auth/permissions.guard';
import { AppPermissions } from '../auth/permissions.decorator';
@ApiTags('Roles')
@UseGuards(JwtAuthGuard, AppPermissionsGuard)
@Controller('roles')
export class RolesController {
  constructor(
    private readonly moduleService: RolesService,
    private readonly responseService: ResponseService,
    @Inject(CustomLoggerService) private readonly logger: CustomLoggerService,
  ) {}

  // Create API
  @Post()
  @AppPermissions('create-role')
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'The role has been successfully created.', type: Role })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: CreateDto })
  @UsePipes(new ValidationPipe({ transform: true }))
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
      this.logger.error(error, 'An error occurred while creating user');
      throw error;
    }
  }

  // Get Listings API
  @Get()
  @AppPermissions('view-role')
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'List of roles', type: [Role] })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: GetDto })
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
      this.logger.error(error, 'An error occurred while fetching all roles');
      throw error;
    }
  }

  // Get single record
  @Get(':id')
  @AppPermissions('view-role')
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID', type: 'number' })
  @ApiBody({ type: GetDto })
  @ApiResponse({ status: 200, description: 'Role found', type: Role })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async findOne(@Param('id') id: bigint, @Res() res: Response) {  // Change type to bigint
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
      this.logger.error(error, `An error occurred while fetching role with id ${id}`);
      throw error;
    }
  }

  // Update API
  @Patch(':id')
  @AppPermissions('update-role')
  @ApiOperation({ summary: 'Update a role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID', type: 'number'})
  @ApiBody({ type: UpdateDto })
  @ApiResponse({ status: 200, description: 'Role updated', type: Role })
  @ApiResponse({ status: 404, description: 'Role not found' })
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
      this.logger.error(error, `An error occurred while updating role with id ${id}`);
      throw error;
    }
  }

  // Delete API
  @Delete(':id')
  @AppPermissions('delete-role')
  @ApiOperation({ summary: 'Delete a role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID', type: 'number'})
  @ApiBody({ type: DeleteDto })
  @ApiResponse({ status: 204, description: 'Role deleted' })
  @ApiResponse({ status: 404, description: 'Role not found' })
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
      this.logger.error(error, `An error occurred while deleting role with id ${id}`);
      throw error;
    }
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Res, HttpStatus, ValidationPipe, UsePipes, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

import { RolesService } from './roles.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { GetDto } from './dto/get.dto';
import { DeleteDto } from './dto/delete.dto';
import { FastifyReply } from 'fastify';  // Import Fastify types
import { Role } from './entities/role.entity';
import { CustomLoggerService } from '../global/logger/logger.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResponseService } from '../global/response/response.service';
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
  async create(@Body(new ValidationPipe({ transform: true, whitelist: true })) data: CreateDto, @Res() res: FastifyReply) {
    try {
      let result = await this.moduleService.create(data);

      let message = 'Unsuccessful. Error occurred!';
      res.status(HttpStatus.BAD_REQUEST);
      if (result) {
        res.status(HttpStatus.OK);
        message = 'Successful';
      }
      return this.responseService.sendResponse(res, message, result);
    } catch (error) {
      this.logger.error(error, 'An error occurred while creating the role');
      throw error;
    }
  }

  // Get Listings API
  @Get()
  @AppPermissions('view-role')
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'List of roles', type: [Role] })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findAll(@Res() res: FastifyReply) {
    try {
      let result = await this.moduleService.findAll();

      let message = 'Unsuccessful. Error occurred!';
      res.status(HttpStatus.BAD_REQUEST);
      if (result) {
        res.status(HttpStatus.OK);
        message = 'Successful';
      }
      return this.responseService.sendResponse(res, message, result);
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
  @ApiResponse({ status: 200, description: 'Role found', type: Role })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async findOne(@Param('id') id: bigint, @Res() res: FastifyReply) {
    try {
      let result = await this.moduleService.findOne(id);

      let message = 'Unsuccessful. Error occurred!';
      res.status(HttpStatus.BAD_REQUEST);
      if (result) {
        res.status(HttpStatus.OK);
        message = 'Successful';
      }
      return this.responseService.sendResponse(res, message, result);
    } catch (error) {
      this.logger.error(error, `An error occurred while fetching role with id ${id}`);
      throw error;
    }
  }

  // Update API
  @Patch(':id')
  @AppPermissions('update-role')
  @ApiOperation({ summary: 'Update a role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID', type: 'number' })
  @ApiBody({ type: UpdateDto })
  @ApiResponse({ status: 200, description: 'Role updated', type: Role })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: bigint, @Body() data: UpdateDto, @Res() res: FastifyReply) {
    try {
      let result = await this.moduleService.update(id, data);

      let message = 'Unsuccessful. Error occurred!';
      res.status(HttpStatus.BAD_REQUEST);
      if (result) {
        res.status(HttpStatus.OK);
        message = 'Successful';
      }
      return this.responseService.sendResponse(res, message, result);
    } catch (error) {
      this.logger.error(error, `An error occurred while updating role with id ${id}`);
      throw error;
    }
  }

  // Delete API
  @Delete(':id')
  @AppPermissions('delete-role')
  @ApiOperation({ summary: 'Delete a role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID', type: 'number' })
  @ApiResponse({ status: 204, description: 'Role deleted' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async remove(@Param() params: DeleteDto, @Res() res: FastifyReply) {
    const { id } = params;
    try {
      let result = await this.moduleService.remove(id);

      let message = 'Unsuccessful. Error occurred!';
      res.status(HttpStatus.BAD_REQUEST);
      if (result) {
        res.status(HttpStatus.OK);
        message = 'Successful';
      }
      return this.responseService.sendResponse(res, message, result);
    } catch (error) {
      this.logger.error(error, `An error occurred while deleting role with id ${id}`);
      throw error;
    }
  }
}

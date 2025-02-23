import { Controller, Body, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateUserDto } from './index';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // User Get all işlemi
  @UseGuards(JwtAuthGuard)
  @Get('all')
  @ApiOperation({ summary: 'Tüm kullanıcıları getir' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          __v: { type: 'number' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  async getUsers() {
    return this.usersService.getUsers();
  }

  // User Get by id işlemi
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Belirli bir kullanıcıyı getir' })
  @ApiResponse({
    status: 200,
    description: 'User details',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        __v: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  @ApiResponse({ status: 404, description: 'User not found' })
  
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  // User Update işlemi & password hashleme işlemi yapıyoruz.
  // Patch işlemi ile sadece istenilen alanları güncelleyebiliriz.
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Kullanıcı bilgilerini güncelle' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Email is already taken' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }
}

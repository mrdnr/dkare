import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './schemas/task.schema';
import { ProjectMemberGuard } from '../guards/project-member.guard';
import { AuthGuard } from '@nestjs/passport';
import { Request as ExpressRequest } from 'express';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
interface RequestWithUser extends ExpressRequest {
  user: {
    userId: string;
    email: string;
  };
}
@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(ProjectMemberGuard)
  @ApiOperation({ summary: 'Yeni görev oluştur' })
  @ApiResponse({ status: 201, description: 'Görev başarıyla oluşturuldu.' })
  @ApiResponse({ status: 400, description: 'Geçersiz veri.' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim.' })
  @ApiResponse({ status: 404, description: 'Proje bulunamadı.' })
  @ApiBody({ type: CreateTaskDto })
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req: RequestWithUser,
  ) {
    const userId = req.user.userId;
    return this.tasksService.createTask(createTaskDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Kullanıcının görevlerini listele' })
  @ApiResponse({
    status: 200,
    description: 'Görevler başarıyla listelendi.',
    schema: {
      properties: {
        tasks: {
          type: 'array',
          items: { type: 'object' },
        },
        total: {
          type: 'number',
          description: 'Toplam görev sayısı',
        },
        page: {
          type: 'number',
          description: 'Mevcut sayfa, başlangıç 0',
        },
        size: {
          type: 'number',
          description: 'Sayfa başına görev sayısı, default 10',
        },
        totalPages: {
          type: 'number',
          description: 'Toplam sayfa sayısı',
        },
      },
    },
  })
  @ApiQuery({ name: 'page', required: false, description: 'Sayfa numarası' })
  @ApiQuery({ name: 'size', required: false, description: 'Sayfa boyutu' })
  async getTasks(
    @Request() req: RequestWithUser,
    @Query('page') page: number = 0,
    @Query('size') size: number = 10,
  ): Promise<{
    tasks: Task[];
    total: number;
    page: number;
    size: number;
    totalPages: number;
  }> {
    const userId = req.user.userId;
    return this.tasksService.getTasks(userId, page, size);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Belirli bir görevi getir' })
  @ApiResponse({ status: 200, description: 'Görev başarıyla getirildi.' })
  @ApiResponse({ status: 404, description: 'Görev bulunamadı.' })
  @ApiParam({ name: 'id', description: 'Görev ID' })
  async getTask(@Param('id') taskId: string): Promise<Task> {
    return this.tasksService.getTask(taskId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Görevi güncelle' })
  @ApiResponse({ status: 200, description: 'Görev başarıyla güncellendi.' })
  @ApiResponse({ status: 400, description: 'Geçersiz veri.' })
  @ApiResponse({ status: 404, description: 'Görev bulunamadı.' })
  @ApiParam({ name: 'id', description: 'Görev ID' })
  @ApiBody({ type: UpdateTaskDto })
  async updateTask(
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTask(taskId, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Görevi sil' })
  @ApiResponse({ status: 200, description: 'Görev başarıyla silindi.' })
  @ApiResponse({ status: 404, description: 'Görev bulunamadı.' })
  @ApiParam({ name: 'id', description: 'Görev ID' })
  async deleteTask(@Param('id') taskId: string): Promise<string> {
    return this.tasksService.deleteTask(taskId);
  }
}

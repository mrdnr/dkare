import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  Patch,
} from '@nestjs/common';
import { SubTasksService } from './subtasks.service';
import { CreateSubTaskDto } from './dto/create-subtask.dto';
import { UpdateSubTaskDto } from './dto/update-subtask.dto';
import { SubTask } from './schemas/subtask.schema';
import { ProjectMemberGuard } from '../guards/project-member.guard';
import { AuthGuard } from '@nestjs/passport';
import { Request as ExpressRequest } from 'express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

interface RequestWithUser extends ExpressRequest {
  user: {
    userId: string;
    email: string;
  };
}

// 📌 Subtask işlemleri için kontrolör
@ApiTags('Subtasks')
@ApiBearerAuth()
@Controller('subtasks')
@UseGuards(AuthGuard('jwt'))
export class SubTasksController {
  constructor(private readonly subTasksService: SubTasksService) {}

  // 📌 Subtask oluşturma
  @Post()
  @UseGuards(ProjectMemberGuard)
  @ApiOperation({ summary: 'Yeni alt görev oluştur' })
  @ApiResponse({ status: 201, description: 'Alt görev başarıyla oluşturuldu.' })
  @ApiResponse({ status: 400, description: 'Geçersiz veri.' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim.' })
  @ApiBody({ type: CreateSubTaskDto })
  async createSubTask(
    @Body() createSubTaskDto: CreateSubTaskDto,
    @Req() req: RequestWithUser,
  ): Promise<SubTask> {
    return this.subTasksService.createSubTask(createSubTaskDto, req.user.userId);
  }

  // 📌 Tüm alt görevleri al
  @Get()
  @ApiOperation({ summary: 'Tüm alt görevleri listele' })
  @ApiResponse({
    status: 200,
    description: 'Alt görevler başarıyla listelendi.',
    schema: {
      properties: {
        subTasks: {
          type: 'array',
          items: { type: 'object' },
        },
        total: {
          type: 'number',
          description: 'Toplam alt görev sayısı',
        },
        page: {
          type: 'number',
          description: 'Mevcut sayfa, başlangıç 0',
        },
        size: {
          type: 'number',
          description: 'Sayfa başına alt görev sayısı, default 10',
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
  async getSubTasks(
    @Req() req: RequestWithUser,
    @Query('page') page: number = 0,
    @Query('size') size: number = 10,
  ): Promise<{
    subTasks: SubTask[];
    total: number;
    page: number;
    size: number;
    totalPages: number;
  }> {
    const userId = req.user.userId;
    return this.subTasksService.getSubTasks(userId, page, size);
  }

  // 📌 Belirli bir alt görevi al
  @Get(':id')
  @ApiOperation({ summary: 'Belirli bir alt görevi getir' })
  @ApiResponse({ status: 200, description: 'Alt görev başarıyla getirildi.' })
  @ApiResponse({ status: 404, description: 'Alt görev bulunamadı.' })
  @ApiParam({ name: 'id', description: 'Alt görev ID' })
  async getSubTask(@Param('id') subTaskId: string): Promise<SubTask> {
    return this.subTasksService.getSubTask(subTaskId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Alt görevi güncelle' })
  @ApiResponse({ status: 200, description: 'Alt görev başarıyla güncellendi.' })
  @ApiResponse({ status: 400, description: 'Geçersiz veri.' })
  @ApiResponse({ status: 404, description: 'Alt görev bulunamadı.' })
  @ApiParam({ name: 'id', description: 'Alt görev ID' })
  @ApiBody({ type: UpdateSubTaskDto })
  async updateSubTask(
    @Param('id') subTaskId: string,
    @Body() updateSubTaskDto: UpdateSubTaskDto,
  ): Promise<SubTask> {
    return this.subTasksService.updateSubTask(subTaskId, updateSubTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Alt görevi sil' })
  @ApiResponse({ status: 200, description: 'Alt görev başarıyla silindi.' })
  @ApiResponse({ status: 404, description: 'Alt görev bulunamadı.' })
  @ApiParam({ name: 'id', description: 'Alt görev ID' })
  async deleteSubTask(@Param('id') subTaskId: string): Promise<string> {
    return this.subTasksService.deleteSubTask(subTaskId);
  }
}

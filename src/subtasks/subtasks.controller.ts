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

interface RequestWithUser extends ExpressRequest {
  user: {
    userId: string;
    email: string;
  };
}

// 📌 Subtask işlemleri için kontrolör
@Controller('subtasks')
@UseGuards(AuthGuard('jwt'))
export class SubTasksController {
  constructor(private readonly subTasksService: SubTasksService) {}

  // 📌 Subtask oluşturma
  @Post()
  @UseGuards(ProjectMemberGuard)
  async createSubTask(
    @Body() createSubTaskDto: CreateSubTaskDto,
    @Req() req: RequestWithUser,
  ): Promise<SubTask> {
    return this.subTasksService.createSubTask(createSubTaskDto, req.user.userId);
  }

  // 📌 Tüm alt görevleri al
  @Get()
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
  async getSubTask(@Param('id') subTaskId: string): Promise<SubTask> {
    return this.subTasksService.getSubTask(subTaskId);
  }

  @Patch(':id')
  async updateSubTask(
    @Param('id') subTaskId: string,
    @Body() updateSubTaskDto: UpdateSubTaskDto,
  ): Promise<SubTask> {
    return this.subTasksService.updateSubTask(subTaskId, updateSubTaskDto);
  }

  @Delete(':id')
  async deleteSubTask(@Param('id') subTaskId: string): Promise<string> {
    return this.subTasksService.deleteSubTask(subTaskId);
  }
}

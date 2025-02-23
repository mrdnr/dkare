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

interface RequestWithUser extends ExpressRequest {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(ProjectMemberGuard)
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req: RequestWithUser,
  ) {
    const userId = req.user.userId;
    return this.tasksService.createTask(createTaskDto, userId);
  }

  @Get()
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
  async getTask(@Param('id') taskId: string): Promise<Task> {
    return this.tasksService.getTask(taskId);
  }

  @Patch(':id')
  async updateTask(
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTask(taskId, updateTaskDto);
  }

  @Delete(':id')
  async deleteTask(@Param('id') taskId: string): Promise<string> {
    return this.tasksService.deleteTask(taskId);
  }
}

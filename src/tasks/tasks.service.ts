import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto, UpdateTaskDto } from './index';
import { Project, ProjectDocument } from '../projects/schemas/project.schema';
import { SubTask, SubTaskDocument } from '../subtasks/schemas/subtask.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(SubTask.name) private readonly subTaskModel: Model<SubTaskDocument>,
  ) {}

  // 📌 Görev oluşturma
  async createTask(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<Task> {
    const task = new this.taskModel({
      ...createTaskDto,
      project: createTaskDto.projectId,
    });
    await task.save();

    await this.projectModel.findByIdAndUpdate(createTaskDto.projectId, {
      $push: { tasks: task._id },
    });

    await this.updateProjectProgress(createTaskDto.projectId);
    return task;
  }

  // 📌 Tüm görevleri al
  async getTasks(
    userId: string,
    page: number = 0,
    size: number = 10,
  ): Promise<{
    tasks: Task[];
    total: number;
    page: number;
    size: number;
    totalPages: number;
  }> {
    const skip = page * size;
    const projects = await this.projectModel
      .find({ users: userId })
      .populate<{ tasks: TaskDocument[] }>({
        path: 'tasks',
        model: this.taskModel,
      })
      .skip(skip)
      .limit(size)
      .exec();

    return {
      tasks: projects.flatMap((project) => project.tasks as Task[]),
      total: projects.length,
      page,
      size,
      totalPages: Math.ceil(projects.length / size),
    };
  }

  // 📌 Görev güncelle
  async updateTask(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.taskModel.findByIdAndUpdate(taskId, updateTaskDto, {
      new: true,
    });
    if (!task) throw new NotFoundException('Task not found');

    await this.updateProjectProgress(task.project.toString());
    return task;
  }

  // 📌 Görev sil
  async deleteTask(taskId: string): Promise<string> {
    const task = await this.taskModel.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');

    await this.projectModel.findByIdAndUpdate(task.project.toString(), {
      $pull: { tasks: task._id },
    });

    await this.updateProjectProgress(task.project.toString());
    await this.subTaskModel.deleteMany({ task: taskId });
    await this.taskModel.findByIdAndDelete(taskId);
    return 'Task deleted successfully';
  }

  // 📌 Proje ilerlemeyi güncelle
  async updateProjectProgress(projectId: string) {
    const project = await this.projectModel
      .findById(projectId)
      .populate<{ tasks: TaskDocument[] }>({
        path: 'tasks',
        model: this.taskModel,
      })
      .exec();

    if (!project) return;

    let totalWeight = 0;
    let completedWeight = 0;

    for (const task of project.tasks) {
      totalWeight += task.weight || 1;
      completedWeight += ((task.progress || 0) * (task.weight || 1)) / 100;
    }

    const newProgress = totalWeight > 0 ? (completedWeight / totalWeight) * 100 : 0;
    project.progress = Math.round(newProgress);
    console.log(project);
    await project.save();
  }

  // 📌 Belirli bir görevi al
  async getTask(taskId: string): Promise<Task> {
    const task = await this.taskModel.findById(taskId);
    if (!task) {
      throw new NotFoundException('Görev bulunamadı');
    }
    return task;
  }
}

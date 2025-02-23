import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubTask, SubTaskDocument } from './schemas/subtask.schema';
import { CreateSubTaskDto } from './dto/create-subtask.dto';
import { UpdateSubTaskDto } from './dto/update-subtask.dto';
import { Task, TaskDocument } from '../tasks/schemas/task.schema';
import { TasksService } from '../tasks/tasks.service';
import { Project, ProjectDocument } from '../projects/schemas/project.schema';

@Injectable()
export class SubTasksService {
  constructor(
    @InjectModel(SubTask.name)
    private readonly subTaskModel: Model<SubTaskDocument>,
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    private readonly tasksService: TasksService,
  ) {}

  // 📌 Alt görev oluştur
  async createSubTask(
    createSubTaskDto: CreateSubTaskDto,
    userId: string,
  ): Promise<SubTask> {
    const task = await this.taskModel.findById(createSubTaskDto.task);
    if (!task) {
      throw new NotFoundException('Task bulunamadı');
    }

    const subTask = new this.subTaskModel({
      ...createSubTaskDto,
      project: task.project,
    });
    await subTask.save();

    await this.taskModel.findByIdAndUpdate(createSubTaskDto.task, {
      $push: { subTasks: subTask._id },
    });

    await this.updateTaskProgress(task.id);
    return subTask;
  }

  // 📌 Tüm alt görevleri al
  async getSubTasks(
    userId: string,
    page: number = 0,
    size: number = 10,
  ): Promise<{
    subTasks: SubTask[];
    total: number;
    page: number;
    size: number;
    totalPages: number;
  }> {
    const skip = page * size;
    const projects = await this.projectModel
      .find({ users: userId })
      .populate({
        path: 'tasks',
        model: 'Task',
        populate: {
          path: 'subTasks',
          model: 'SubTask'
        }
      })
      .skip(skip)
      .limit(size)
      .exec();

    const allSubTasks = projects.flatMap((project) =>
      project.tasks?.map((task: any) => task.subTasks).flat() || []
    );

    return {
      subTasks: allSubTasks,
      total: allSubTasks.length,
      page,
      size,
      totalPages: Math.ceil(allSubTasks.length / size),
    };
  }

  // 📌 Alt görev güncelle
  async updateSubTask(
    subTaskId: string,
    updateSubTaskDto: UpdateSubTaskDto,
  ): Promise<SubTask> {
    const subTask = await this.subTaskModel.findByIdAndUpdate(
      subTaskId,
      updateSubTaskDto,
      { new: true },
    );
    if (!subTask) throw new NotFoundException('SubTask not found');

    await this.updateTaskProgress(subTask.task.toString());
    return subTask;
  }

  // 📌 Alt görev sil
  async deleteSubTask(subTaskId: string): Promise<string> {
    const subTask = await this.subTaskModel.findByIdAndDelete(subTaskId);
    if (!subTask) throw new NotFoundException('SubTask not found');

    await this.taskModel.findByIdAndUpdate(subTask.task.toString(), {
      $pull: { subTasks: subTask._id },
    });

    await this.updateTaskProgress(subTask.task.toString());
    return 'SubTask deleted successfully';
  }

  // 📌 Görev ilerlemeyi güncelle
  async updateTaskProgress(taskId: string) {
    const task = await this.taskModel
      .findById(taskId)
      .populate<{ subTasks: SubTaskDocument[] }>({
        path: 'subTasks',
        model: this.subTaskModel,
      })
      .exec();

    if (!task) return;

    let totalWeight = 0;
    let completedWeight = 0;

    for (const subTask of task.subTasks) {
      totalWeight += subTask.weight || 1;
      completedWeight +=
        ((subTask.progress || 0) * (subTask.weight || 1)) / 100;
    }

    const newProgress =
      totalWeight > 0 ? (completedWeight / totalWeight) * 100 : 0;
    task.progress = Math.round(newProgress);
    await task.save();

    await this.tasksService.updateProjectProgress(task.project.toString());
  }

  // 📌 Belirli bir alt görevi al
  async getSubTask(subTaskId: string): Promise<SubTask> {
    const subTask = await this.subTaskModel.findById(subTaskId);
    if (!subTask) {
      throw new NotFoundException('Alt görev bulunamadı');
    }
    return subTask;
  }
}

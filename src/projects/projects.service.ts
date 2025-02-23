import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto, UpdateProjectDto } from './index';
import * as fs from 'fs';
import * as path from 'path';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Task, TaskDocument } from '../tasks/schemas/task.schema';
import { SubTask, SubTaskDocument } from '../subtasks/schemas/subtask.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(SubTask.name) private subTaskModel: Model<SubTaskDocument>,
  ) {}

  // 📌 Proje oluşturma
  async create(
    createProjectDto: CreateProjectDto,
    userId: string,
  ): Promise<Project> {
    const project = new this.projectModel({
      ...createProjectDto,
      users: [userId],
    });
    return project.save();
  }

  // 📌 Kullanıcının yer aldığı projeleri listeleme
  async findAll(
    userId: string,
    page: number = 0,
    size: number = 10,
  ): Promise<{
    projects: Project[];
    total: number;
    page: number;
    size: number;
    totalPages: number;
  }> {
    const skip = page * size;

    const [projects, total] = await Promise.all([
      this.projectModel
        .find({ users: userId })
        .populate({
          path: 'tasks',
          model: 'Task',
          populate: {
            path: 'subTasks',
            model: 'SubTask',
          },
        })
        .skip(skip)
        .limit(size)
        .exec(),
      this.projectModel.countDocuments({ users: userId }),
    ]);
    if (projects.length === 0) {
      throw new NotFoundException('Proje bulunamadı');
    }
    return {
      projects,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
  }

  // 📌 Belirli bir projeyi getirme
  async findOne(id: string): Promise<any> {
    const project = await this.projectModel.findById(id).exec();
    if (!project) throw new NotFoundException('Proje bulunamadı');

    const serverUrl = process.env.SERVER_URL || 'http://localhost:3000';
    const projectObj = project.toObject();

    if (projectObj.image) {
      projectObj.imageUrl = `${serverUrl}/assets/${projectObj.image}`;
    }

    return projectObj;
  }

  // 📌 Projeyi güncelleme
  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    file?: Express.Multer.File,
  ): Promise<Project> {
    const project = (await this.projectModel.findById(id)) as ProjectDocument;
    if (!project) {
      throw new NotFoundException('Proje bulunamadı');
    }

    if (file) {
      if (project.image) {
        const oldImagePath = path.join(process.cwd(), 'assets', project.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateProjectDto.image = file.filename;
    }

    if (updateProjectDto.users && Array.isArray(updateProjectDto.users)) {
      const newUsers = updateProjectDto.users.map(
        (userId) => new Types.ObjectId(userId),
      );
      project.users = Array.from(new Set([...project.users, ...newUsers]));
    }

    if (updateProjectDto.name) {
      project.name = updateProjectDto.name;
    }
    if (updateProjectDto.description) {
      project.description = updateProjectDto.description;
    }
    if (updateProjectDto.image) {
      project.image = updateProjectDto.image;
    }

    return project.save();
  }

  // 📌 Projeyi silme
  async remove(id: string): Promise<string> {
    const project = await this.projectModel.findById(id);
    if (!project) {
      throw new NotFoundException('Proje bulunamadı');
    }

    // Resmi sil
    if (project.image) {
      const imagePath = path.join(process.cwd(), 'assets', project.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await this.subTaskModel.deleteMany({ project: id });
    await this.taskModel.deleteMany({ project: id });
    await this.projectModel.findByIdAndDelete(id);
    return 'Proje ve alt görevler başarıyla silindi.';
  }
}

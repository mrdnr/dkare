import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from '../projects/index';

@Injectable()
export class ProjectMemberGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;
    const projectId = request.query.id || request.params.id || request.body.projectId;
    if (!userId) {
      throw new UnauthorizedException('User ID is not provided');
    }

    if (!projectId) {
      throw new ForbiddenException('Project ID is not provided');
    }

    const project = await this.projectModel.findById(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (!project.users.includes(userId)) {
      throw new UnauthorizedException('You do not have access to this project');
    }

    return true;
  }
}

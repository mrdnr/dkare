import { Module, forwardRef } from '@nestjs/common';
import { SubTasksController } from './subtasks.controller';
import { SubTasksService } from './subtasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SubTask, SubTaskSchema } from './schemas/subtask.schema';
import { Task, TaskSchema } from '../tasks/schemas/task.schema';
import { Project, ProjectSchema } from '../projects/schemas/project.schema';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubTask.name, schema: SubTaskSchema },
      { name: Task.name, schema: TaskSchema },
      { name: Project.name, schema: ProjectSchema },
    ]),
    forwardRef(() => TasksModule),
  ],
  controllers: [SubTasksController],
  providers: [SubTasksService],
  exports: [MongooseModule.forFeature([{ name: SubTask.name, schema: SubTaskSchema }])],
})
export class SubtasksModule {}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TaskDocument = Task & Document;

export interface Task {
  name: string;
  project: Types.ObjectId;
  subTasks: Types.ObjectId[];
  progress: number;
  weight: number;
}

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true }) 
  project: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'SubTask' }] }) 
  subTasks: Types.ObjectId[];

  @Prop({ default: 0, min: 0, max: 100 }) 
  progress: number; // Görevin ilerleme yüzdesi (Alt görevlerden hesaplanacak)

  @Prop({ default: 1, min: 1, max: 100 }) 
  weight: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

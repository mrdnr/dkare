import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubTaskDocument = SubTask & Document;

export interface SubTask {
  name: string;
  task: Types.ObjectId;
  project: Types.ObjectId;
  progress: number;
  weight: number;
}

@Schema({ timestamps: true })
export class SubTask {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Task', required: true }) 
  task: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  project: Types.ObjectId;

  @Prop({ default: 0, min: 0, max: 100 })
  progress: number;

  @Prop({ default: 1, min: 1, max: 100 }) 
  weight: number;
}

export const SubTaskSchema = SchemaFactory.createForClass(SubTask);

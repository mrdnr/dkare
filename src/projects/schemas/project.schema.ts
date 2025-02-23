import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProjectDocument = Project & Document;

export interface Project {
  name: string;
  tasks: Types.ObjectId[];
  progress: number;
  image?: string;
  imageUrl?: string;
  users: Types.ObjectId[];
}

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }] }) 
  tasks: Types.ObjectId[];

  @Prop({ default: 0 })
  progress: number;

  @Prop({ required: false }) 
  image?: string;

  @Prop({ required: true, type: [{ type: Types.ObjectId, ref: 'User' }] })
  users: Types.ObjectId[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.virtual('imageUrl').get(function() {
  if (!this.image) return null;
  const serverUrl = process.env.SERVER_URL || 'http://localhost:3000';
  return `${serverUrl}/assets/${this.image}`;
});

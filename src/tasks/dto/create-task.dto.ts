import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsMongoId, IsOptional, Min, Max, IsNumber } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Görev başlığı' })
  @IsString()
  name: string;

  @ApiProperty({ example: '65b3e2c9a8eaf23c0c8a3b2d' })
  @IsMongoId()
  projectId: string;

  @ApiProperty({ example: 0, minimum: 0, maximum: 100, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress?: number;

  @ApiProperty({ example: 2, default: 1, minimum: 1, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  weight?: number;
}
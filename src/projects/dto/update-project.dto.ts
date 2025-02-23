import { IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto {
  @ApiProperty({ example: 'Proje Adı', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Proje Açıklaması', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Max: 5MB, Format: JPEG, JPG, PNG, SVG', description: 'Proje resmi', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: ['userId1', 'userId2'], description: 'Yeni proje üyeleri', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  users?: string[];
}
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Min, Max, IsNumber } from 'class-validator';

export class UpdateSubTaskDto {
  @ApiProperty({ example: 'Alt görev başlığı', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 50, minimum: 0, maximum: 100, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress?: number;

  @ApiProperty({ example: 2, required: false, minimum: 1, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  weight?: number;
}

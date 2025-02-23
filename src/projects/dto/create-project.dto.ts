import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'Proje Adı', required: true })
  @IsNotEmpty({ message: 'Proje adı zorunludur' })
  @IsString({ message: 'Proje adı string olmalıdır' })
  name: string;

  @ApiProperty({ example: 'Proje Açıklaması', required: true })
  @IsNotEmpty({ message: 'Proje açıklaması zorunludur' })
  @IsString({ message: 'Proje açıklaması string olmalıdır' })
  description: string;

  @ApiProperty({ example: 'Proje Resim Yükleme', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: 'Projeye Erişecek Kullanıcılar', required: true })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  users: string[];
}

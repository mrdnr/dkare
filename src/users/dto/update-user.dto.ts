import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'Kullanıcının adı', example: 'Emre' })
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Kullanıcının e-posta adresi, unique olmalıdır.', example: 'emre.doner35@gmail.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Kullanıcının şifresi, en az 6 karakter olmalıdır.', example: 'emre1234' })
  @IsOptional()
  @MinLength(6)
  password?: string;
}

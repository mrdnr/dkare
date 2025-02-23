import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'Kullanıcının adı', example: 'Emre' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Kullanıcının e-posta adresi, unique olmalıdır.', example: 'emre.doner35@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Kullanıcının şifresi, en az 6 karakter olmalıdır.', example: 'emre1234' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

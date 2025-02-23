import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Kullanıcının e-posta adresi', example: 'emre.doner35@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Kullanıcının şifresi', example: 'emre1234' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

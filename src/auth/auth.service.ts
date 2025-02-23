import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './index';
import { verifyPassword } from '../common/bcrypt.helper';
import { PasswordNotMatchError } from '../errors/auth-errors';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // User Register işlemi
  async register(registerDto: RegisterDto) {
    await this.usersService.createUser(registerDto);
    return { message: 'User registered successfully' };
  }

  // User Login işlemi
  async login(loginDto: LoginDto) {
    const user = await this.usersService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) throw new PasswordNotMatchError();

    await verifyPassword(loginDto.password, user.password);

    const token = this.jwtService.sign({ id: user._id, email: user.email });
    return {
      message: 'Login successful',
      accessToken: token,
    };
  }
}

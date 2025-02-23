import { UnauthorizedException, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';

export class PasswordNotMatchError extends UnauthorizedException {
  constructor(message: string = 'Invalid credentials') {
    super(message);
    this.name = 'PasswordNotMatchError';
  }
}

export class UserNotFoundError extends NotFoundException {
  constructor(message: string = 'User not found') {
    super(message);
    this.name = 'UserNotFoundError';
  }
}

export class EmailIsTakenError extends HttpException {
  constructor(message: string = 'Email is already taken') {
    super(message, HttpStatus.CONFLICT);
    this.name = 'EmailIsTakenError';
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto, User, UserDocument } from './index';
import { UserNotFoundError, EmailIsTakenError } from '../errors/auth-errors';
import { encrypt, verifyPassword } from '../common/bcrypt.helper';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // User Create işlemi & password hashleme işlemi yapıyoruz.
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();
    if (existingUser) {
      throw new EmailIsTakenError();
    }

    const hashedPassword = await encrypt(createUserDto.password);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  // User Get by id işlemi
  async getUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }

  // User Get all işlemi
  async getUsers(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    if (!users) {
      throw new UserNotFoundError();
    }
    return users;
  }

  // User Update işlemi tek sorgulamada tüm gerekli işlemleri yapıyoruz.
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await encrypt(updateUserDto.password);
    }

    if (updateUserDto.email) {
      const existingUser = await this.userModel
        .findOne({ email: updateUserDto.email })
        .exec();
      if (existingUser && existingUser._id.toString() !== id) {
        throw new EmailIsTakenError();
      }
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new UserNotFoundError();
    }

    return updatedUser;
  }

  // Auth Service için kullanılacak login işlemi
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UserNotFoundError('User not found');
    }

    await verifyPassword(password, user.password);
    return user;
  }
}

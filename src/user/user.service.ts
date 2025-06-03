import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/crate-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(crateUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      const user = await this.userModel.create(crateUserDto);
      return user;
    } catch (err) {
      console.error('User 생성 실패', err);
      throw new InternalServerErrorException('User 생성 중 오류 발생');
    }
  }
}

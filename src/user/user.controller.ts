import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { BaseResponse } from 'src/common/dto/base-response.dto';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/crate-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async crateUser(
    @Body() crateUserDto: CreateUserDto,
  ): Promise<BaseResponse<User>> {
    const user = await this.userService.createUser(crateUserDto);
    return {
      success: true,
      message: 'User가 성공적으로 생성됨',
      data: user,
    };
  }
}

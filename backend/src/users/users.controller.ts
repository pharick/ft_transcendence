import {
  Controller,
  Get,
  Param,
  Logger,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { User } from './user.entity';
import UserInfo from './userInfo.interface';

@Controller('users')
export class UsersController {
  private logger: Logger = new Logger('UsersController');

  constructor(private usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':userId')
  async findOne(
    @Param('userId', new ParseIntPipe()) userId: number,
  ): Promise<UserInfo> {
    const user: UserInfo = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException();
    return user;
  }
}

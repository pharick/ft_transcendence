import {
  Controller,
  Get,
  Param,
  Logger,
  NotFoundException,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { UsersService } from './users.service';
import { User } from './user.entity';
import UserInfo from './userInfo.interface';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  private logger: Logger = new Logger('UsersController');

  constructor(private usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getCurrentUser(@Req() request: Request) {
    return request.user;
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

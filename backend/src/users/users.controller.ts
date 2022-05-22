import {
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { User } from './user.entity';

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
  ): Promise<User> {
    const user: User = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException();
    return user;
  }
}

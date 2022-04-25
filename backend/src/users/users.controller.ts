import { Controller, Get, Logger, Session } from '@nestjs/common';

import { UsersService } from "./users.service";
import { User } from "./user.entity";

@Controller('users')
export class UsersController {
  private logger: Logger = new Logger('UsersController');

  constructor(private usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('me')
  async getCurrentUser(@Session() session: Record<string, any>) {
    const userId = session.userId;
    const user = await this.usersService.findOne(userId);
    return {
      user: user,
    };
  }
}

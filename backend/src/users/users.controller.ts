import { Controller, Get, Logger } from '@nestjs/common';

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
}

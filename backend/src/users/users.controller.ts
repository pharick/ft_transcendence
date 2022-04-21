import {Controller, Get, Logger, Session} from "@nestjs/common";

import { UsersService } from "./users.service";
import { User } from "./user.entity";

interface AuthData {
  user_id: number;
}

@Controller('users')
export class UsersController {
  private logger: Logger = new Logger('UsersController');

  constructor(private usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('isauth')
  isAuth(@Session() session: Record<string, any>): AuthData {
    this.logger.log('Is auth requested');
    return {
      user_id: session.user_id ? session.user_id : 0,
    };
  }
}

import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UserStatusService } from './userStatus.service';
import { UserStatusInterface } from './userStatus.interface';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Controller('status')
export class UserStatusController {
  constructor(
    private userStatusService: UserStatusService,
    private usersService: UsersService,
  ) {}

  @Get(':id')
  async findOne(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<UserStatusInterface> {
    const user: User = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException();
    return { status: this.userStatusService.findOne(id) };
  }
}

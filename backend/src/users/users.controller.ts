import {
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  private logger: Logger = new Logger('UsersController');

  constructor(private usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Req() request) {
    return request.user;
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseIntPipe()) userId: number,
  ): Promise<User> {
    const user: User = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException();
    return user;
  }
}

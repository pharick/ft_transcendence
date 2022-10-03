import {
  Controller,
  Delete,
  Logger,
  Param,
  ParseIntPipe,
  Get,
  Req,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { TwoFactorJwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FriendsNote } from './friends.entity';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
  private logger: Logger = new Logger('FriendsController');

  constructor(
    private friendsService: FriendsService,
    private usersService: UsersService,
  ) {}

  @Get(':userId')
  async findAllByUser(
    @Param('userId', new ParseIntPipe()) userId: number,
  ): Promise<FriendsNote[]> {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException();
    return this.friendsService.findAllByUser(userId);
  }

  @UseGuards(TwoFactorJwtAuthGuard)
  @Delete(':userId')
  async remove(
    @Req() request: Request,
    @Param('userId', new ParseIntPipe()) userId: number,
  ) {
    await this.friendsService.remove(userId, request.user);
  }
}

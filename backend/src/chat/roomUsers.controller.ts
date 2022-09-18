import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RoomUsersService } from './roomUsers.service';
import { ChatRoomUserType } from './chatRoomUser.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('chat/users')
export class RoomUsersController {
  constructor(private roomUsersService: RoomUsersService) {}

  @Post(':userId/makeAdmin')
  @UseGuards(JwtAuthGuard)
  async makeAdmin(
    @Req() request: Request,
    @Param('userId', new ParseIntPipe()) userId: number,
  ): Promise<void> {
    const currentUser = await this.roomUsersService.findOne(request.user.id);
    if (currentUser.type == ChatRoomUserType.Owner)
      await this.roomUsersService.makeAdmin(userId);
  }

  @Post(':userId/revokeAdmin')
  @UseGuards(JwtAuthGuard)
  async revokeAdmin(
    @Req() request: Request,
    @Param('userId', new ParseIntPipe()) userId: number,
  ): Promise<void> {
    const currentUser = await this.roomUsersService.findOne(request.user.id);
    if (currentUser.type == ChatRoomUserType.Owner)
      await this.roomUsersService.revokeAdmin(userId);
  }
}

import {
  Body,
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
import { BlockChatUserDto, MuteChatUserDto } from './chat.dtos';

@Controller('chat/users')
export class RoomUsersController {
  constructor(private roomUsersService: RoomUsersService) {}

  @Post(':userId/makeAdmin')
  @UseGuards(JwtAuthGuard)
  async makeAdmin(
    @Req() request: Request,
    @Param('userId', new ParseIntPipe()) userId: number,
  ): Promise<void> {
    const requester = await this.roomUsersService.findOne(request.user.id);
    const user = await this.roomUsersService.findOne(userId);
    if (
      requester.room.id == user.room.id &&
      requester.type == ChatRoomUserType.Owner
    )
      await this.roomUsersService.makeAdmin(userId);
  }

  @Post(':userId/revokeAdmin')
  @UseGuards(JwtAuthGuard)
  async revokeAdmin(
    @Req() request: Request,
    @Param('userId', new ParseIntPipe()) userId: number,
  ): Promise<void> {
    const requester = await this.roomUsersService.findOne(request.user.id);
    const user = await this.roomUsersService.findOne(userId);
    if (
      requester.room.id == user.room.id &&
      requester.type == ChatRoomUserType.Owner
    )
      await this.roomUsersService.revokeAdmin(userId);
  }

  @Post(':userId/block')
  @UseGuards(JwtAuthGuard)
  async blockUser(
    @Req() request: Request,
    @Param('userId', new ParseIntPipe()) userId: number,
    @Body() { durationMin }: BlockChatUserDto,
  ): Promise<void> {
    const requester = await this.roomUsersService.findOne(request.user.id);
    const user = await this.roomUsersService.findOne(userId);
    if (
      requester.room.id == user.room.id &&
      (requester.type == ChatRoomUserType.Owner ||
        requester.type == ChatRoomUserType.Admin)
    )
      await this.roomUsersService.setBlock(userId, durationMin);
  }

  @Post(':userId/mute')
  @UseGuards(JwtAuthGuard)
  async muteUser(
    @Req() request: Request,
    @Param('userId', new ParseIntPipe()) userId: number,
    @Body() { durationMin }: MuteChatUserDto,
  ): Promise<void> {
    const requester = await this.roomUsersService.findOne(request.user.id);
    const user = await this.roomUsersService.findOne(userId);
    if (
      requester.room.id == user.room.id &&
      (requester.type == ChatRoomUserType.Owner ||
        requester.type == ChatRoomUserType.Admin)
    )
      await this.roomUsersService.setMute(userId, durationMin);
  }
}

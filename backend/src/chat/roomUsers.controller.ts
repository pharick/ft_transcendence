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
import { TwoFactorJwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { BanChatUserDto, MuteChatUserDto } from './chat.dtos';

@Controller('chat/users')
export class RoomUsersController {
  constructor(private roomUsersService: RoomUsersService) {}

  @Post(':userId/makeAdmin')
  @UseGuards(TwoFactorJwtAuthGuard)
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
  @UseGuards(TwoFactorJwtAuthGuard)
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

  @Post(':userId/ban')
  @UseGuards(TwoFactorJwtAuthGuard)
  async banUser(
    @Req() request: Request,
    @Param('userId', new ParseIntPipe()) userId: number,
    @Body() { durationMin }: BanChatUserDto,
  ): Promise<void> {
    const requester = await this.roomUsersService.findOne(request.user.id);
    const user = await this.roomUsersService.findOne(userId);
    if (
      requester.room.id == user.room.id &&
      (requester.type == ChatRoomUserType.Owner ||
        requester.type == ChatRoomUserType.Admin)
    )
      await this.roomUsersService.setBan(userId, durationMin);
  }

  @Post(':userId/mute')
  @UseGuards(TwoFactorJwtAuthGuard)
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

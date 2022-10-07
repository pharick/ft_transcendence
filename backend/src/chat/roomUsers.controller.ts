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

  @Post(':roomId/users/:roomUserId/makeAdmin')
  @UseGuards(TwoFactorJwtAuthGuard)
  async makeAdmin(
    @Req() request: Request,
    @Param('roomId', new ParseIntPipe()) roomId: number,
    @Param('roomUserId', new ParseIntPipe()) roomUserId: number,
  ): Promise<void> {
    const requester = await this.roomUsersService.findOneByUserId(
      roomId,
      request.user.id,
    );
    const user = await this.roomUsersService.findOne(roomUserId);
    if (
      requester.room.id == user.room.id &&
      requester.type == ChatRoomUserType.Owner
    )
      await this.roomUsersService.makeAdmin(roomUserId);
  }

  @Post(':roomId/users/:roomUserId/revokeAdmin')
  @UseGuards(TwoFactorJwtAuthGuard)
  async revokeAdmin(
    @Req() request: Request,
    @Param('roomId', new ParseIntPipe()) roomId: number,
    @Param('roomUserId', new ParseIntPipe()) roomUserId: number,
  ): Promise<void> {
    const requester = await this.roomUsersService.findOneByUserId(
      roomId,
      request.user.id,
    );
    const user = await this.roomUsersService.findOne(roomUserId);
    if (
      requester.room.id == user.room.id &&
      requester.type == ChatRoomUserType.Owner
    )
      await this.roomUsersService.revokeAdmin(roomUserId);
  }

  @Post(':roomId/users/:roomUserId/ban')
  @UseGuards(TwoFactorJwtAuthGuard)
  async banUser(
    @Req() request: Request,
    @Param('roomId', new ParseIntPipe()) roomId: number,
    @Param('roomUserId', new ParseIntPipe()) roomUserId: number,
    @Body() { durationMin }: BanChatUserDto,
  ): Promise<void> {
    const requester = await this.roomUsersService.findOneByUserId(
      roomId,
      request.user.id,
    );
    const user = await this.roomUsersService.findOne(roomUserId);
    if (
      requester.room.id == user.room.id &&
      (requester.type == ChatRoomUserType.Owner ||
        requester.type == ChatRoomUserType.Admin)
    )
      await this.roomUsersService.setBan(roomUserId, durationMin);
  }

  @Post(':roomId/users/:roomUserId/mute')
  @UseGuards(TwoFactorJwtAuthGuard)
  async muteUser(
    @Req() request: Request,
    @Param('roomId', new ParseIntPipe()) roomId: number,
    @Param('roomUserId', new ParseIntPipe()) roomUserId: number,
    @Body() { durationMin }: MuteChatUserDto,
  ): Promise<void> {
    const requester = await this.roomUsersService.findOneByUserId(
      roomId,
      request.user.id,
    );
    const user = await this.roomUsersService.findOne(roomUserId);
    if (
      requester.room.id == user.room.id &&
      (requester.type == ChatRoomUserType.Owner ||
        requester.type == ChatRoomUserType.Admin)
    )
      await this.roomUsersService.setMute(roomUserId, durationMin);
  }
}

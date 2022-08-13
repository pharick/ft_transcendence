import { Body, Controller, Put, Req, UseGuards } from '@nestjs/common';
import { ChatRoomsService } from './chatRooms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { CreateChatRoomDto } from './chat.dtos';
import { ChatRoom } from './chatRoom.entity';

@Controller('chat/rooms')
export class ChatRoomController {
  constructor(private chatRoomsService: ChatRoomsService) {}

  @Put()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() request: Request,
    @Body() { name, password }: CreateChatRoomDto,
  ): Promise<ChatRoom> {
    return this.chatRoomsService.createRoom(name, password, request.user.id);
  }
}

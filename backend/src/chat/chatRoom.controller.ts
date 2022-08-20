import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatRoomsService } from './chatRooms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { CreateChatRoomDto } from './chat.dtos';
import { ChatRoom } from './chatRoom.entity';
import { Game } from '../games/games.interfaces';

@Controller('chat/rooms')
export class ChatRoomController {
  constructor(private chatRoomsService: ChatRoomsService) {}

  @Put()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() request: Request,
    @Body() { name, password }: CreateChatRoomDto,
  ): Promise<ChatRoom> {
    return this.chatRoomsService.create(name, password, request.user.id);
  }

  @Get()
  findAll(): Promise<ChatRoom[]> {
    return this.chatRoomsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<ChatRoom> {
    const room = await this.chatRoomsService.findOne(id);
    if (!room) throw new NotFoundException();
    return room;
  }
}

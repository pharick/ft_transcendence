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
import { TwoFactorJwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { CreateChatRoomDto } from './chat.dtos';
import { ChatRoom } from './chatRoom.entity';

@Controller('chat/rooms')
export class ChatRoomsController {
  constructor(private chatRoomsService: ChatRoomsService) {}

  @Put()
  @UseGuards(TwoFactorJwtAuthGuard)
  create(
    @Req() request: Request,
    @Body() { name, type, password }: CreateChatRoomDto,
  ): Promise<ChatRoom> {
    return this.chatRoomsService.create(name, type, password, request.user.id);
  }

  @Get()
  @UseGuards(TwoFactorJwtAuthGuard)
  findAll(@Req() request: Request): Promise<ChatRoom[]> {
    return this.chatRoomsService.findAll(request.user.id);
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

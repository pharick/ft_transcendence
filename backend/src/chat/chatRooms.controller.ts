import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatRoomsService } from './chatRooms.service';
import { TwoFactorJwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { CreateChatRoomDto, InviteChatUserDto } from './chat.dtos';
import { ChatRoom } from './chatRoom.entity';

@Controller('chat/rooms')
export class ChatRoomsController {
  private logger = new Logger('ChatRoomsController');

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
  @UseGuards(TwoFactorJwtAuthGuard)
  async findOne(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<ChatRoom> {
    const room = await this.chatRoomsService.findOne(id);
    if (!room) throw new NotFoundException();
    return room;
  }

  @Get('directs/:userId')
  @UseGuards(TwoFactorJwtAuthGuard)
  async findDirect(
    @Req() request: Request,
    @Param('userId', new ParseIntPipe()) userId: number,
  ): Promise<ChatRoom> {
    const room = await this.chatRoomsService.findDirect(
      userId,
      request.user.id,
    );
    if (!room) {
    }
    return room;
  }

  @Put(':id/invites')
  @UseGuards(TwoFactorJwtAuthGuard)
  async inviteUser(
    @Req() request: Request,
    @Param('id', new ParseIntPipe()) roomId: number,
    @Body() { userId }: InviteChatUserDto,
  ) {
    const invite = await this.chatRoomsService
      .inviteUser(request.user.id, roomId, userId)
      .catch((error) => {
        this.logger.error(error);
        throw new ConflictException();
      });
    if (!invite) throw new ForbiddenException();
    return invite;
  }

  @Delete('invites/:inviteId')
  @UseGuards(TwoFactorJwtAuthGuard)
  async removeInvite(
    @Req() request: Request,
    @Param('inviteId', new ParseIntPipe()) inviteId: number,
  ) {
    await this.chatRoomsService.removeInvite(inviteId, request.user.id);
  }

  @Post('invites/:inviteId/accept')
  @UseGuards(TwoFactorJwtAuthGuard)
  async acceptInvite(
    @Req() request: Request,
    @Param('inviteId', new ParseIntPipe()) inviteId: number,
  ) {
    await this.chatRoomsService.acceptInvite(inviteId, request.user.id);
  }
}

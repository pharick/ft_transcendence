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
import {
  CreateChatRoomDto,
  CreateDirectDto,
  InviteChatUserDto,
} from './chat.dtos';
import { ChatRoom } from './chatRoom.entity';
import { Direct } from './direct.entity';

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
  async findOne(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<ChatRoom> {
    const room = await this.chatRoomsService.findOne(id);
    if (!room) throw new NotFoundException();
    return room;
  }

  @Put('directs')
  @UseGuards(TwoFactorJwtAuthGuard)
  async createDirect(
    @Req() request: Request,
    @Body() { userId }: CreateDirectDto,
  ): Promise<Direct> {
    return this.chatRoomsService
      .createDirect(request.user.id, userId)
      .catch((error) => {
        this.logger.error(error);
        throw new ConflictException();
      });
  }

  @Get('directs/:userId')
  @UseGuards(TwoFactorJwtAuthGuard)
  async findDirect(
    @Req() request: Request,
    @Param('userId', new ParseIntPipe()) userId: number,
  ): Promise<Direct> {
    const direct = await this.chatRoomsService.findDirect(
      request.user.id,
      userId,
    );
    if (!direct) throw new NotFoundException();
    return direct;
  }

  @Post('directs/:userId/block')
  @UseGuards(TwoFactorJwtAuthGuard)
  async blockDirect(
    @Req() request: Request,
    @Param('userId', new ParseIntPipe()) userId: number,
  ) {
    const direct = await this.chatRoomsService.findDirect(
      request.user.id,
      userId,
    );
    if (!direct) throw new NotFoundException();
    await this.chatRoomsService.blockDirect(direct.id, userId);
  }

  @Post('directs/:userId/unblock')
  @UseGuards(TwoFactorJwtAuthGuard)
  async unblockDirect(
    @Req() request: Request,
    @Param('userId', new ParseIntPipe()) userId: number,
  ) {
    const direct = await this.chatRoomsService.findDirect(
      request.user.id,
      userId,
    );
    if (!direct) throw new NotFoundException();
    await this.chatRoomsService.unblockDirect(direct.id, userId);
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

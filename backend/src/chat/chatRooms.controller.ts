import {
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { ChatRoomsService } from './chatRooms.service';
import { ChatRoom } from './chatRoom.entity';
import { UsersService } from '../users/users.service';

@Controller('chat/rooms')
export class ChatRoomsController {
  private logger: Logger = new Logger('ChatRoomsController');

  constructor(
    private chatRoomsService: ChatRoomsService,
    private usersService: UsersService,
  ) {}

  @Get('private')
  findAllPrivate(@Session() session: Record<string, any>): Promise<ChatRoom[]> {
    const userId = session.userId;
    if (!userId) throw new UnauthorizedException();
    return this.chatRoomsService.findAllPrivate(userId);
  }

  @Get('private/:companionId')
  async findOnePrivate(
    @Param('companionId', new ParseIntPipe()) companionId: number,
    @Session() session: Record<string, any>,
  ): Promise<ChatRoom> {
    const userId = session.userId;
    if (!userId) throw new UnauthorizedException();
    const room = await this.chatRoomsService.findOnePrivate(
      userId,
      companionId,
    );

    if (!room) {
      const user1 = await this.usersService.findOne(userId);
      const user2 = await this.usersService.findOne(companionId);
      if (!user1 || !user2 || user1.id == user2.id)
        throw new NotFoundException();
      return this.chatRoomsService.create({
        isPrivate: true,
        hostUser: user1,
        guestUser: user2,
      });
    }

    return room;
  }
}

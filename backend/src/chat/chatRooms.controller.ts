import {
  Controller,
  Get,
  Logger, NotFoundException,
  Param,
  ParseIntPipe,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { ChatRoomsService } from './chatRooms.service';
import { ChatRoom } from './chatRoom.entity';

@Controller('chat/rooms')
export class ChatRoomsController {
  private logger: Logger = new Logger('ChatRoomsController');

  constructor(private chatRoomsService: ChatRoomsService) {}

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
    if (!room) throw new NotFoundException();
    return room;
  }
}

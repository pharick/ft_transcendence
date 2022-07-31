import { Controller, Logger } from '@nestjs/common';
import { ChatRoomsService } from './chatRooms.service';
import { UsersService } from '../users/users.service';

@Controller('chat/rooms')
export class ChatRoomsController {
  private logger: Logger = new Logger('ChatRoomsController');

  constructor(
    private chatRoomsService: ChatRoomsService,
    private usersService: UsersService,
  ) {}

  // create(chatRoomDto: ChatRoomDto): Promise<ChatRoom> {
  //
  // }
}

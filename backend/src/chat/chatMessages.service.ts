import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './chatMessage.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { ChatRoomsService } from './chatRooms.service';

@Injectable()
export class ChatMessagesService {
  private logger: Logger = new Logger('UsersService');

  constructor(
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
    private chatRoomsService: ChatRoomsService,
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  // async create(chatMessage: ChatMessageDto): Promise<ChatMessage> {
  //   const userId = this.authService.getUserIdBySessionId(chatMessage.sessionId);
  //   if (!userId) return null;
  //
  //   if (chatMessage.roomId) {
  //     const room =
  //   }
  // }

  // async findAllCommon(): Promise<ChatMessage[]> {
  //   // вообще хрень какая-то но через where не работает нифига
  //   return (
  //     await this.chatMessageRepository.find({
  //       order: {
  //         date: 'ASC',
  //       },
  //       relations: ['user', 'room'],
  //     })
  //   ).filter((message) => message.room === null);
  // }
}

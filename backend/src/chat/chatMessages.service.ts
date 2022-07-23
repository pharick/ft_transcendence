import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './chatMessage.entity';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { ChatMessageDto } from './chatMessage.dto';
import { ChatRoomsService } from './chatRooms.service';
import { ChatRoom } from './chatRoom.entity';

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

  async create(chatMessageDto: ChatMessageDto): Promise<ChatMessage> {
    const userId: number = this.authService.getUserIdBySessionId(
      chatMessageDto.sessionId,
    );
    const user: User = await this.usersService.findOne(userId);
    const room: ChatRoom = chatMessageDto.roomId
      ? await this.chatRoomsService.findOne(chatMessageDto.roomId)
      : null;

    if (!user) {
      this.logger.log(`No user`);
      return null;
    }
    console.log(room);
    if (room && room.guestUser.id != user.id && room.hostUser.id != user.id) {
      this.logger.log(`Forbidden`);
      return;
    }

    const message = this.chatMessageRepository.create({
      user,
      room: room,
      text: chatMessageDto.text,
    });
    return await this.chatMessageRepository.save(message);
  }

  async findAllCommon(): Promise<ChatMessage[]> {
    // вообще хрень какая-то но через where не работает нифига
    return (
      await this.chatMessageRepository.find({
        order: {
          date: 'ASC',
        },
        relations: ['user', 'room'],
      })
    ).filter((message) => message.room === null);
  }

  async findAllPrivate(
    user1Id: number,
    user2Id: number,
  ): Promise<ChatMessage[]> {
    const room = await this.chatRoomsService.findOnePrivate(user1Id, user2Id);
    if (!room) throw new NotFoundException();
    return this.chatMessageRepository.find({
      where: {
        room: { id: room.id },
      },
      order: {
        date: 'ASC',
      },
      relations: ['user'],
    });
  }
}

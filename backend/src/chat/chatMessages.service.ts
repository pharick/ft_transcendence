import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ChatMessage } from './chatMessage.entity';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { ChatMessageDto } from './chatMessage.dto';
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

  async create(chatMessageDto: ChatMessageDto): Promise<ChatMessage> {
    const userId: number = this.authService.getUserIdBySessionId(
      chatMessageDto.sessionId,
    );
    const user: User = await this.usersService.findOne(userId);
    if (!user) return null;
    const message = this.chatMessageRepository.create({
      user,
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

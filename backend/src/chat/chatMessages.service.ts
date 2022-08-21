import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './chatMessage.entity';
import { UsersService } from '../users/users.service';
import { ChatRoomsService } from './chatRooms.service';

@Injectable()
export class ChatMessagesService {
  private logger: Logger = new Logger('ChatMessagesService');

  constructor(
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
    private usersService: UsersService,
    @Inject(forwardRef(() => ChatRoomsService))
    private chatRoomsService: ChatRoomsService,
  ) {}

  async create(
    userId: number,
    roomId: number,
    text: string,
  ): Promise<ChatMessage> {
    const user = await this.usersService.findOne(userId);
    const room = await this.chatRoomsService.findOne(roomId);
    if (!user || !room) return undefined;
    const message = this.chatMessageRepository.create({ user, room, text });
    return this.chatMessageRepository.save(message);
  }

  async findAllByRoom(roomId: number): Promise<ChatMessage[]> {
    const room = await this.chatRoomsService.findOne(roomId);
    if (!room) return undefined;
    return await this.chatMessageRepository.find({
      where: { room },
      order: {
        date: 'ASC',
      },
      relations: ['user'],
    });
  }
}

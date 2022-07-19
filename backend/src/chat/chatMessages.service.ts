import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './chatMessage.entity';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { ChatMessageDto } from './chatMessage.dto';

@Injectable()
export class ChatMessagesService {
  private logger: Logger = new Logger('UsersService');

  constructor(
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
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

  findAllCommon(): Promise<ChatMessage[]> {
    return this.chatMessageRepository.find({
      where: {
        room: null,
      },
      order: {
        date: 'ASC',
      },
      relations: ['user'],
    });
  }
}

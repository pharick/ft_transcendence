import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from './chatRoom.entity';
import { ChatRoomDto } from './charRoom.dto';

@Injectable()
export class ChatRoomsService {
  private logger: Logger = new Logger('UsersService');

  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
  ) {}

  create(chatRoomDto: ChatRoomDto): Promise<ChatRoom> {
    const room = this.chatRoomRepository.create(chatRoomDto);
    return this.chatRoomRepository.save(room);
  }

  findOne(id: number): Promise<ChatRoom> {
    return this.chatRoomRepository.findOne({
      where: { id },
      relations: ['hostUser', 'guestUser'],
    });
  }

  findOnePrivate(user1Id: number, user2Id: number): Promise<ChatRoom> {
    return this.chatRoomRepository.findOne({
      where: [
        {
          hostUser: { id: user1Id },
          guestUser: { id: user2Id },
        },
        {
          hostUser: { id: user2Id },
          guestUser: { id: user1Id },
        },
      ],
      relations: ['hostUser', 'guestUser'],
    });
  }
}

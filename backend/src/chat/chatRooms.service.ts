import { Injectable } from '@nestjs/common';
import { ChatRoom } from './chatRoom.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomUser } from './roomUser.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ChatRoomsService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomsRepository: Repository<ChatRoom>,
    @InjectRepository(RoomUser)
    private roomUserRepository: Repository<RoomUser>,
    private usersService: UsersService,
  ) {}

  async createRoom(
    name: string,
    password: string,
    userId: number,
  ): Promise<ChatRoom> {
    const user = await this.usersService.findOne(userId);
    if (!user) return undefined;
    const chatRoom = this.chatRoomsRepository.create({
      name,
      password,
    });
    const savedChatRoom = await this.chatRoomsRepository.save(chatRoom);
    const roomUser = this.roomUserRepository.create({
      user,
      room: savedChatRoom,
    });
    await this.roomUserRepository.save(roomUser);
    return savedChatRoom;
  }
}

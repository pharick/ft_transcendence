import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ChatRoom, ChatRoomType } from './chatRoom.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ChatRoomUser, ChatRoomUserType } from './chatRoomUser.entity';
import { UsersService } from '../users/users.service';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatRoomsService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomsRepository: Repository<ChatRoom>,
    @InjectRepository(ChatRoomUser)
    private roomUserRepository: Repository<ChatRoomUser>,
    private usersService: UsersService,
    @Inject(forwardRef(() => ChatGateway))
    private chatGateway: ChatGateway,
  ) {}

  async create(
    name: string,
    type: ChatRoomType,
    password: string,
    userId: number,
  ): Promise<ChatRoom> {
    const user = await this.usersService.findOne(userId);
    if (!user) return undefined;
    const chatRoom = this.chatRoomsRepository.create({
      name,
      type,
      password,
    });
    const savedChatRoom = await this.chatRoomsRepository.save(chatRoom);
    const roomUser = this.roomUserRepository.create({
      user,
      room: savedChatRoom,
      type: ChatRoomUserType.Owner,
    });
    await this.roomUserRepository.save(roomUser);
    return savedChatRoom;
  }

  async findAll(userId: number): Promise<ChatRoom[]> {
    const myRoomIds = (
      await this.roomUserRepository.find({
        where: {
          user: { id: userId },
        },
        relations: ['room'],
      })
    ).map((roomUser) => roomUser.room.id);
    return this.chatRoomsRepository.find({
      where: [
        { type: ChatRoomType.Public },
        { type: ChatRoomType.Protected },
        { id: In(myRoomIds) },
      ],
      relations: ['users', 'users.user'],
    });
  }

  findOne(id: number): Promise<ChatRoom> {
    return this.chatRoomsRepository.findOneBy({ id });
  }

  async authenticate(
    roomId: number,
    userId: number,
    password: string = null,
  ): Promise<ChatRoomUser> {
    const room = await this.chatRoomsRepository.findOneBy({ id: roomId });
    const user = await this.usersService.findOne(userId);
    if (!room || !user) return undefined;
    const roomUser = await this.roomUserRepository.findOneBy({ user, room });
    if (roomUser) return roomUser;
    if (
      room.type == ChatRoomType.Public ||
      (room.type == ChatRoomType.Protected && room.password === password)
    ) {
      const newRoomUser = this.roomUserRepository.create({ user, room });
      return this.roomUserRepository.save(newRoomUser);
    }
    return undefined;
  }

  async getRoomUsers(
    roomId: number,
  ): Promise<(ChatRoomUser & { isOnline?: boolean })[]> {
    const room = await this.chatRoomsRepository.findOneBy({ id: roomId });
    if (!room) return undefined;
    const roomUsers: (ChatRoomUser & { isOnline?: boolean })[] =
      await this.roomUserRepository.find({
        where: { room },
        relations: ['user'],
      });
    roomUsers.forEach((roomUser) => {
      roomUser.isOnline = this.chatGateway.server.adapter.rooms.has(
        `user-${roomUser.user.id}`,
      );
    });
    return roomUsers;
  }

  async resetBan(roomUserId: number) {
    await this.roomUserRepository.update(
      { id: roomUserId },
      { bannedUntil: null },
    );
  }
}

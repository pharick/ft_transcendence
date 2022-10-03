import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ChatRoom, ChatRoomType } from './chatRoom.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ChatRoomUser, ChatRoomUserType } from './chatRoomUser.entity';
import { UsersService } from '../users/users.service';
import { ChatGateway } from './chat.gateway';
import { hash, compare } from 'bcrypt';
import { ChatRoomInvite } from './chatRoomInvite.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ChatRoomsService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomsRepository: Repository<ChatRoom>,
    @InjectRepository(ChatRoomUser)
    private roomUserRepository: Repository<ChatRoomUser>,
    @InjectRepository(ChatRoomInvite)
    private chatRoomInviteRepository: Repository<ChatRoomInvite>,
    private usersService: UsersService,
    @Inject(forwardRef(() => ChatGateway))
    private chatGateway: ChatGateway,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
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
    });
    if (password) {
      const passwordHash = await hash(password, 10);
      chatRoom.passwordHash = passwordHash;
    }
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
    if (!room || !user || (room.type == ChatRoomType.Protected && !password))
      return undefined;
    const roomUser = await this.roomUserRepository.findOne({
      where: { user, room },
      relations: ['user'],
    });
    if (roomUser) return roomUser;
    if (
      room.type == ChatRoomType.Public ||
      (room.type == ChatRoomType.Protected &&
        (await compare(password, room.passwordHash)))
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

  async inviteUser(
    inviterUserId: number,
    roomId: number,
    userId: number,
  ): Promise<ChatRoomInvite> {
    const room = await this.chatRoomsRepository.findOneBy({ id: roomId });
    const user = await this.usersService.findOne(userId);
    if (!room || !user) return undefined;
    const inviterRoomUser = await this.authenticate(roomId, inviterUserId);
    if (!inviterRoomUser) return undefined;
    const invite = this.chatRoomInviteRepository.create({
      inviter: inviterRoomUser.user,
      user,
      room,
    });
    const savedInvite = await this.chatRoomInviteRepository.save(invite);
    await this.notificationsService.send(savedInvite.user.id);
    return savedInvite;
  }

  async acceptInvite(inviteId: number, userId: number) {
    const invite = await this.chatRoomInviteRepository.findOne({
      where: {
        id: inviteId,
      },
      relations: ['user', 'room'],
    });
    if (!invite) return;
    if (invite.user.id != userId && invite.inviter.id != userId) {
      throw new ForbiddenException();
    }
    const chatRoomUser = await this.roomUserRepository.create({
      room: invite.room,
      user: invite.user,
    });
    await this.roomUserRepository.save(chatRoomUser);
    await this.chatRoomInviteRepository.remove(invite);
    await this.notificationsService.send(invite.user.id);
  }

  async removeInvite(inviteId: number, userId: number) {
    const invite = await this.chatRoomInviteRepository.findOne({
      where: {
        id: inviteId,
      },
      relations: ['user'],
    });
    if (!invite) return;
    if (invite.user.id != userId && invite.inviter.id != userId) {
      throw new ForbiddenException();
    }
    await this.chatRoomInviteRepository.remove(invite);
    await this.notificationsService.send(invite.user.id);
  }

  async findAllInvitesByUser(userId: number): Promise<ChatRoomInvite[]> {
    return this.chatRoomInviteRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'room', 'inviter'],
    });
  }
}

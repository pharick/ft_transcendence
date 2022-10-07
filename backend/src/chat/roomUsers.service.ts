import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoomUser, ChatRoomUserType } from './chatRoomUser.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomUsersService {
  constructor(
    @InjectRepository(ChatRoomUser)
    private roomUserRepository: Repository<ChatRoomUser>,
  ) {}

  findOne(id: number): Promise<ChatRoomUser> {
    return this.roomUserRepository.findOne({
      where: { id },
      relations: ['room'],
    });
  }

  findOneByUserId(roomId: number, userId: number): Promise<ChatRoomUser> {
    return this.roomUserRepository.findOne({
      where: { room: { id: roomId }, user: { id: userId } },
      relations: ['room'],
    });
  }

  async makeAdmin(roomUserId: number) {
    const user = await this.roomUserRepository.findOneBy({ id: roomUserId });
    if (user.type != ChatRoomUserType.Owner) {
      user.type = ChatRoomUserType.Admin;
      await this.roomUserRepository.save(user);
    }
  }

  async revokeAdmin(roomUserId: number) {
    await this.roomUserRepository.update(
      { id: roomUserId },
      { type: ChatRoomUserType.Common },
    );
  }

  async setBan(roomUserId: number, duration: number) {
    await this.roomUserRepository.update(
      { id: roomUserId },
      { bannedUntil: new Date(Date.now() + duration * 60000) },
    );
  }

  async resetBan(roomUserId: number) {
    await this.roomUserRepository.update(
      { id: roomUserId },
      { bannedUntil: null },
    );
  }

  async setMute(roomUserId: number, duration: number) {
    await this.roomUserRepository.update(
      { id: roomUserId },
      { mutedUntil: new Date(Date.now() + duration * 60000) },
    );
  }

  async resetMute(roomUserId: number) {
    await this.roomUserRepository.update(
      { id: roomUserId },
      { mutedUntil: null },
    );
  }
}

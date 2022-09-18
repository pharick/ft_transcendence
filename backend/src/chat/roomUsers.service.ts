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

  async resetBan(roomUserId: number) {
    await this.roomUserRepository.update(
      { id: roomUserId },
      { bannedUntil: null },
    );
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
}

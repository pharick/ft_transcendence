import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import UserInfo from './userInfo.interface';
import { UserStatusService } from '../notifications/userStatus.service';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private userStatusService: UserStatusService,
  ) {}

  create(username: string): Promise<User> {
    const user = this.usersRepository.create({ username });
    return this.usersRepository.save(user);
  }

  async updateRank(userId: number, rankDelta: number): Promise<void> {
    const user = await this.findOne(userId);
    user.oldRank = user.rank;
    user.rank += rankDelta;
    if (user.rank < 0) {
      user.rank = 0;
    }
    await this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserInfo> {
    if (!id) return null;
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) return null;
    return {
      ...user,
      isOnline: this.userStatusService.isUserOnline(id),
    };
  }

  findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneBy({ username: username });
  }

  public async setAvatar(userId: number, avatarUrl: string) {
    this.usersRepository.update(userId, {avatar: avatarUrl});
  }

  public async setDisplayName(userId: number, newDisplayName: string) {
    this.usersRepository.update(userId, {displayName: newDisplayName});
  }
}

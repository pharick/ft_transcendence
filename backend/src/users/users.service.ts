import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOrCreate(
    ids: Record<string, number>,
    username: string = null,
  ): Promise<User> {
    let user = await this.usersRepository.findOneBy(ids);
    if (!user) user = this.usersRepository.create({ ...ids, username });
    return await this.usersRepository.save(user);
  }

  async updateRank(userId: number, rankDelta: number): Promise<User> {
    const user = await this.findOne(userId);
    user.prevRank = user.rank;
    user.rank += rankDelta;
    if (rankDelta > 0) user.rankedWins += 1;
    if (rankDelta < 0) user.rankedLoses += 1;
    if (user.rank < 0) user.rank = 0;
    return await this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  async setAvatar(userId: number, avatarUrl: string) {
    await this.usersRepository.update(userId, { avatar: avatarUrl });
  }

  async updateProfile(userId: number, profile: QueryDeepPartialEntity<User>) {
    await this.usersRepository.update(userId, profile);
  }

  async setTwoFactorSecret(userId: number, secret: string): Promise<void> {
    await this.usersRepository.update(userId, { twoFactorSecret: secret });
  }

  async enable2FactorAuth(userId: number) {
    await this.usersRepository.update(userId, { twoFactorEnabled: true });
  }
}

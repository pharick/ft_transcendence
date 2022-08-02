import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger('UsersService');

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
    if (user.rank < 0) user.rank = 0;
    return await this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }
}

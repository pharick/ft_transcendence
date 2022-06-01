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

  create(username: string): Promise<User> {
    const user = this.usersRepository.create({ username });
    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    if (!id) return null;
    return this.usersRepository.findOneBy({ id });
  }

  findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneBy({ username: username });
  }
}

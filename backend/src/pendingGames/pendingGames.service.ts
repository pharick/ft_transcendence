import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PendingGame } from './pendingGame.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class PendingGamesService {
  constructor(
    @InjectRepository(PendingGame)
    private pendingGamesRepository: Repository<PendingGame>,
  ) {}

  async findAll(): Promise<PendingGame[]> {
    return this.pendingGamesRepository.find();
  }

  create(hostUser: User, guestUser: User | null): Promise<PendingGame> {
    const pendingGame = this.pendingGamesRepository.create({
      hostUser,
      guestUser,
    });
    return this.pendingGamesRepository.save(pendingGame);
  }
}

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PendingGame } from './pendingGame.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PendingGamesService {
  constructor(
    @InjectRepository(PendingGame)
    private pendingGamesRepository: Repository<PendingGame>,
  ) {}

  findAll(): Promise<PendingGame[]> {
    return this.pendingGamesRepository.find({
      relations: ['hostUser', 'guestUser'],
    });
  }

  findOne(id: number): Promise<PendingGame> {
    return this.pendingGamesRepository.findOne({
      where: { id },
      relations: ['hostUser', 'guestUser'],
    });
  }

  findByHost(hostUserId: number): Promise<PendingGame[]> {
    return this.pendingGamesRepository.find({
      relations: ['hostUser', 'guestUser'],
      where: {
        hostUser: {
          id: hostUserId,
        },
      },
    });
  }

  findByGuest(guestUserId: number): Promise<PendingGame[]> {
    return this.pendingGamesRepository.find({
      relations: ['hostUser', 'guestUser'],
      where: {
        guestUser: {
          id: guestUserId,
        },
      },
    });
  }

  create(hostUserId: number, guestUserId?: number): Promise<PendingGame> {
    const pendingGame = this.pendingGamesRepository.create({
      hostUser: { id: guestUserId },
      guestUser: { id: hostUserId },
    });
    return this.pendingGamesRepository.save(pendingGame);
  }

  async remove(pendingGameId: number): Promise<void> {
    const game: PendingGame = await this.pendingGamesRepository.findOne({
      where: { id: pendingGameId },
    });
    await this.pendingGamesRepository.remove(game);
  }
}

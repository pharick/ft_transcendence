import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PendingGame } from './pendingGame.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class PendingGamesService {
  constructor(
    @InjectRepository(PendingGame)
    private pendingGamesRepository: Repository<PendingGame>,
    private usersService: UsersService,
  ) {}

  async create(player1Id: number, player2Id: number): Promise<PendingGame> {
    const player1 = await this.usersService.findOne(player1Id);
    const player2 = await this.usersService.findOne(player2Id);
    if (!player1 || !player2) return undefined;
    const pendingGame = this.pendingGamesRepository.create({
      player1,
      player2,
    });
    return this.pendingGamesRepository.save(pendingGame);
  }

  findAll(): Promise<PendingGame[]> {
    return this.pendingGamesRepository.find({
      relations: ['player1', 'player2'],
    });
  }

  findOne(id: number): Promise<PendingGame> {
    return this.pendingGamesRepository.findOne({
      where: { id },
      relations: ['player1', 'player2'],
    });
  }

  async findAllByUser(id: number): Promise<PendingGame[]> {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException();
    return this.pendingGamesRepository
      .createQueryBuilder('pending_game')
      .where(
        'pending_game.player1Id = :userId or pending_game.player2Id = :userId',
        { userId: user.id },
      )
      .leftJoinAndSelect('pending_game.player1', 'player1')
      .leftJoinAndSelect('pending_game.player2', 'player2')
      .getMany();
  }

  async remove(id: number) {
    const game: PendingGame = await this.pendingGamesRepository.findOneBy({
      id,
    });
    await this.pendingGamesRepository.remove(game);
  }
}

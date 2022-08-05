import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PendingGame } from './pendingGame.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PendingGamesService {
  constructor(
    @InjectRepository(PendingGame)
    private pendingGamesRepository: Repository<PendingGame>,
    private usersService: UsersService,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
  ) {}

  async create(player1Id: number, player2Id: number): Promise<PendingGame> {
    const player1 = await this.usersService.findOne(player1Id);
    const player2 = await this.usersService.findOne(player2Id);
    if (!player1 || !player2) return undefined;
    const pendingGame = this.pendingGamesRepository.create({
      player1,
      player2,
    });
    const game = await this.pendingGamesRepository.save(pendingGame);
    await this.notificationsService.send(game.player1.id);
    await this.notificationsService.send(game.player2.id);
    return game;
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

  async findAllByUser(userId: number): Promise<PendingGame[]> {
    return this.pendingGamesRepository
      .createQueryBuilder('pending_game')
      .where(
        'pending_game.player1Id = :userId or pending_game.player2Id = :userId',
        { userId },
      )
      .leftJoinAndSelect('pending_game.player1', 'player1')
      .leftJoinAndSelect('pending_game.player2', 'player2')
      .getMany();
  }

  async remove(id: number) {
    const game: PendingGame = await this.pendingGamesRepository.findOne({
      where: { id },
      relations: ['player1', 'player2'],
    });
    const player1Id = game.player1.id;
    const player2Id = game.player2.id;
    await this.pendingGamesRepository.remove(game);
    await this.notificationsService.send(player1Id);
    await this.notificationsService.send(player2Id);
  }
}

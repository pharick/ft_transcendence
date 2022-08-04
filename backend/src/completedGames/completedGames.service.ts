import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompletedGame } from './completedGame.entity';
import { Repository } from 'typeorm';
import { CompletedGameDto } from './completedGame.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class CompletedGamesService {
  private logger: Logger = new Logger('CompletedGamesService');

  constructor(
    @InjectRepository(CompletedGame)
    private completedGamesRepository: Repository<CompletedGame>,
    private usersService: UsersService,
  ) {}

  create(completedGameDto: CompletedGameDto): Promise<CompletedGame> {
    const completedGame =
      this.completedGamesRepository.create(completedGameDto);
    return this.completedGamesRepository.save(completedGame);
  }

  findOne(id: number): Promise<CompletedGame> {
    return this.completedGamesRepository.findOne({
      where: { id },
      relations: ['player1', 'player2'],
    });
  }

  async findAllByUser(userId: number): Promise<CompletedGame[]> {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException();
    return this.completedGamesRepository
      .createQueryBuilder('completed_game')
      .where(
        'completed_game.player1Id = :userId or completed_game.player2Id = :userId',
        { userId: user.id },
      )
      .leftJoinAndSelect('completed_game.player1', 'player1')
      .leftJoinAndSelect('completed_game.player2', 'player2')
      .getMany();
  }
}

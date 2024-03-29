import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompletedGame } from './completedGame.entity';
import { Repository } from 'typeorm';
import { CompletedGameDto } from './completedGame.dto';

@Injectable()
export class CompletedGamesService {
  constructor(
    @InjectRepository(CompletedGame)
    private completedGamesRepository: Repository<CompletedGame>,
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
    return this.completedGamesRepository
      .createQueryBuilder('completed_game')
      .where(
        'completed_game.player1Id = :userId or completed_game.player2Id = :userId',
        { userId },
      )
      .leftJoinAndSelect('completed_game.player1', 'player1')
      .leftJoinAndSelect('completed_game.player2', 'player2')
      .orderBy({ 'completed_game.date': 'DESC' })
      .getMany();
  }
}

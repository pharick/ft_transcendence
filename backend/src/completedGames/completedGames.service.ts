import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompletedGame } from './completedGame.entity';
import { Repository } from 'typeorm';
import { CompletedGameDto } from './completedGame.dto';

@Injectable()
export class CompletedGamesService {
  private logger: Logger = new Logger('CompletedGamesService');

  constructor(
    @InjectRepository(CompletedGame)
    private completedGamesRepository: Repository<CompletedGame>,
  ) {}

  create(completedGameDto: CompletedGameDto): Promise<CompletedGame> {
    const completedGame =
      this.completedGamesRepository.create(completedGameDto);
    return this.completedGamesRepository.save(completedGame);
  }

  // SELECT * FROM completedGames WHERE id = ?;
  findOne(id: number): Promise<CompletedGame> {
    return this.completedGamesRepository.findOne({
      where: { id },
      relations: ['hostUser', 'guestUser'],
    });
  }

  findAllByUser(userId: number): Promise<CompletedGame[]> {
    return this.completedGamesRepository.find({
      relations: ['hostUser', 'guestUser'],
      where: [
        {
          hostUser: {
            id: userId,
          },
        },
        {
          guestUser: {
            id: userId,
          },
        },
      ]
    });
  }
}

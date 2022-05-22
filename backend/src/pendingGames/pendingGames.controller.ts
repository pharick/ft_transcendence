import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { PendingGamesService } from './pendingGames.service';
import { PendingGame } from './pendingGame.entity';
import { CreatePendingGameDto } from './pendingGames.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Controller('pending')
export class PendingGamesController {
  private logger: Logger = new Logger('PendingGamesController');

  constructor(
    private pendingGamesService: PendingGamesService,
    private usersService: UsersService,
  ) {}

  @Get()
  findAll(): Promise<PendingGame[]> {
    return this.pendingGamesService.findAll();
  }

  @Get('host/:hostUserId')
  findByHost(
    @Param('hostUserId', new ParseIntPipe()) hostUserId: number,
  ): Promise<PendingGame[]> {
    return this.pendingGamesService.findByHost(hostUserId);
  }

  @Get('guest/:guestUserId')
  findByGuest(
    @Param('guestUserId', new ParseIntPipe()) guestUserId: number,
  ): Promise<PendingGame[]> {
    return this.pendingGamesService.findByGuest(guestUserId);
  }

  @Post()
  async create(
    @Session() session: Record<string, any>,
    @Body() createPendingGameDto: CreatePendingGameDto,
  ): Promise<PendingGame> {
    const hostUserId: number = session.userId;
    const guestUserId: number = createPendingGameDto.guestUserId;

    const hostUser: User = await this.usersService.findOne(hostUserId);
    const guestUser: User = await this.usersService.findOne(guestUserId);

    if (!hostUserId) throw new UnauthorizedException();
    return this.pendingGamesService.create(hostUser, guestUser);
  }
}

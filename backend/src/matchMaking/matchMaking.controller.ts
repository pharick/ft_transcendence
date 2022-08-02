import {
  Controller,
  Delete,
  Logger,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MatchMakingService } from './matchMaking.service';
import { Request } from 'express';

@Controller('matchMaking')
export class MatchMakingController {
  private logger: Logger = new Logger('MatchMakingController');

  constructor(private matchMakingGamesService: MatchMakingService) {}

  // @Put()
  // // @UseGuards(AuthGuard)
  // async addUserToQueue(@Req() request: Request): Promise<void> {
  //   await this.matchMakingGamesService.addUserToQueue(request.user.id);
  // }
  //
  // @Delete()
  // // @UseGuards(AuthGuard)
  // async removeUserFromQueue(@Req() request: Request): Promise<void> {
  //   await this.matchMakingGamesService.removeUserFromQueue(request.user.id);
  // }
}

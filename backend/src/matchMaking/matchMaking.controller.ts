import { Controller, Delete, Put, Req, UseGuards } from '@nestjs/common';
import { MatchMakingService } from './matchMaking.service';
import { Request } from 'express';
import { TwoFactorJwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('matchMaking')
export class MatchMakingController {
  constructor(private matchMakingGamesService: MatchMakingService) {}

  @Put()
  @UseGuards(TwoFactorJwtAuthGuard)
  async addUserToQueue(@Req() request: Request): Promise<void> {
    await this.matchMakingGamesService.addUserToQueue(request.user.id);
  }

  @Delete()
  @UseGuards(TwoFactorJwtAuthGuard)
  async removeUserFromQueue(@Req() request: Request): Promise<void> {
    await this.matchMakingGamesService.removeUserFromQueue(request.user.id);
  }
}

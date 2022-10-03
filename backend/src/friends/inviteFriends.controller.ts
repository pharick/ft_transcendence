import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { TwoFactorJwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateInviteFriendDto } from './createInviteFriend.dto';
import { InviteFriends } from './inviteFriends.entity';
import { InviteFriendsService } from './inviteFriends.service';

@Controller('friends/invites')
export class InviteFriendsController {
  private logger: Logger = new Logger('InviteFriendsController');

  constructor(private inviteFriendsService: InviteFriendsService) {}

  @UseGuards(TwoFactorJwtAuthGuard)
  @Put()
  create(
    @Req() request: Request,
    @Body() { friendId }: CreateInviteFriendDto,
  ): Promise<InviteFriends> {
    return this.inviteFriendsService
      .create(request.user.id, friendId)
      .catch((error) => {
        this.logger.error(error);
        throw new ConflictException();
      });
  }

  @UseGuards(TwoFactorJwtAuthGuard)
  @Delete(':inviteId')
  async delete(
    @Req() request: Request,
    @Param('inviteId', new ParseIntPipe()) inviteId: number,
  ) {
    await this.inviteFriendsService.remove(inviteId, request.user);
  }

  @UseGuards(TwoFactorJwtAuthGuard)
  @Post(':inviteId/accept')
  async accept(
    @Req() request: Request,
    @Param('inviteId', new ParseIntPipe()) inviteId: number,
  ) {
    await this.inviteFriendsService.accept(inviteId, request.user);
  }
}

import { Module } from '@nestjs/common';
import { GamesModule } from '../games/games.module';
import { AuthModule } from '../auth/auth.module';
import { UserStatusService } from './userStatus.service';
import { UserStatusGateway } from './userStatus.gateway';
import { UserStatusController } from './userStatus.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [GamesModule, AuthModule, UsersModule],
  providers: [UserStatusService, UserStatusGateway],
  controllers: [UserStatusController],
  exports: [UserStatusService],
})
export class UserStatusModule {}

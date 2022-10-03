import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { InviteFriends } from './inviteFriends.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { InviteFriendsService } from './inviteFriends.service';
import { InviteFriendsController } from './inviteFriends.controller';
import { FriendsNote } from './friends.entity';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';

@Module({
  imports: [
    UsersModule,
    forwardRef(() => NotificationsModule),
    TypeOrmModule.forFeature([InviteFriends, FriendsNote]),
  ],
  providers: [InviteFriendsService, FriendsService],
  controllers: [InviteFriendsController, FriendsController],
  exports: [InviteFriendsService, FriendsService],
})
export class FriendsModule {}

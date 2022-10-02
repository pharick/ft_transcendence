import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './chatRoom.entity';
import { ChatRoomUser } from './chatRoomUser.entity';
import { ChatRoomsController } from './chatRooms.controller';
import { ChatRoomsService } from './chatRooms.service';
import { UsersModule } from '../users/users.module';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from '../auth/auth.module';
import { ChatMessage } from './chatMessage.entity';
import { ChatMessagesService } from './chatMessages.service';
import { RoomUsersService } from './roomUsers.service';
import { RoomUsersController } from './roomUsers.controller';
import { ChatRoomInvite } from './chatRoomInvite.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatRoom,
      ChatRoomUser,
      ChatMessage,
      ChatRoomInvite,
    ]),
    UsersModule,
    AuthModule,
    forwardRef(() => NotificationsModule),
  ],
  providers: [
    ChatRoomsService,
    RoomUsersService,
    ChatMessagesService,
    ChatGateway,
  ],
  controllers: [ChatRoomsController, RoomUsersController],
  exports: [ChatRoomsService],
})
export class ChatModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './chatRoom.entity';
import { ChatRoomUser } from './chatRoomUser.entity';
import { ChatRoomController } from './chatRoom.controller';
import { ChatRoomsService } from './chatRooms.service';
import { UsersModule } from '../users/users.module';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from '../auth/auth.module';
import { ChatMessage } from './chatMessage.entity';
import { ChatMessagesService } from './chatMessages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoom, ChatRoomUser, ChatMessage]),
    UsersModule,
    AuthModule,
  ],
  providers: [ChatRoomsService, ChatMessagesService, ChatGateway],
  controllers: [ChatRoomController],
})
export class ChatModule {}

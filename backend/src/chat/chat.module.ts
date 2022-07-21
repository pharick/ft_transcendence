import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './chatMessage.entity';
import { ChatRoom } from './chatRoom.entity';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { ChatMessagesService } from './chatMessages.service';
import { User } from '../users/user.entity';
import { ChatMessagesController } from './chatMessages.controller';
import { ChatRoomsService } from './chatRooms.service';
import { ChatRoomsController } from './chatRooms.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoom, ChatMessage, User]),
    AuthModule,
    UsersModule,
  ],
  providers: [ChatGateway, ChatMessagesService, ChatRoomsService],
  controllers: [ChatMessagesController, ChatRoomsController],
  exports: [],
})
export class ChatModule {}

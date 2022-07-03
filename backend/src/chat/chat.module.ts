import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './chatMessage.entity';
import { ChatRoom } from './chatRoom.entity';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { ChatService } from './chat.service';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoom, ChatMessage, User]),
    AuthModule,
    UsersModule,
  ],
  providers: [ChatGateway, ChatService],
  controllers: [],
  exports: [],
})
export class ChatModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './chatRoom.entity';
import { RoomUser } from './roomUser.entity';
import { ChatRoomController } from './chatRoom.controller';
import { ChatRoomsService } from './chatRooms.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, RoomUser]), UsersModule],
  providers: [ChatRoomsService],
  controllers: [ChatRoomController],
})
export class ChatModule {}

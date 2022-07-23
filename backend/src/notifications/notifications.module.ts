import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { UserStatusService } from './userStatus.service';

@Module({
  imports: [],
  providers: [NotificationsGateway, UserStatusService],
  controllers: [],
  exports: [NotificationsGateway, UserStatusService],
})
export class NotificationsModule {}

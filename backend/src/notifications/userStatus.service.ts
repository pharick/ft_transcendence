import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserStatusService {
  private logger: Logger = new Logger('UserStatusService');
  private users: Record<string, number> = {};

  add(socketClientId: string, userId: number): void {
    this.users[socketClientId] = userId;
  }

  remove(socketClientId): void {
    delete this.users[socketClientId];
  }

  isUserOnline(userId: number): boolean {
    const userIds = Object.values(this.users);
    return userIds.includes(userId);
  }
}

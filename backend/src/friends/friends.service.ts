import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/user.entity';
import { FriendsNote } from './friends.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(FriendsNote)
    private friendsNotesRepository: Repository<FriendsNote>,
    private usersService: UsersService,
  ) {}

  async findAllByUser(userId: number): Promise<FriendsNote[]> {
    return this.friendsNotesRepository.find({
      where: {
        user1: { id: userId },
      },
      relations: ['user2', 'user1'],
    });
  }

  async remove(userId: number, friend: User) {
    const user1 = await this.usersService.findOne(userId);
    const user2 = await this.usersService.findOne(friend.id);
    const checkFriends1 = await this.friendsNotesRepository.findOneBy({
      user1: user1,
      user2: user2,
    });
    const checkFriends2 = await this.friendsNotesRepository.findOneBy({
      user1: user2,
      user2: user1,
    });
    if (!checkFriends1 || !checkFriends2) return undefined;
    await this.friendsNotesRepository.delete(checkFriends2);
    await this.friendsNotesRepository.delete(checkFriends1);
  }
}

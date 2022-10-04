import {
  Injectable,
  forwardRef,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InviteFriends } from './inviteFriends.entity';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { User } from 'src/users/user.entity';
import { FriendsNote } from './friends.entity';

@Injectable()
export class InviteFriendsService {
  constructor(
    @InjectRepository(InviteFriends)
    private inviteFriendsRepository: Repository<InviteFriends>,
    @InjectRepository(FriendsNote)
    private friendsNotesRepository: Repository<FriendsNote>,
    private usersService: UsersService,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
  ) {}

  async create(inviterId: number, friendId: number): Promise<InviteFriends> {
    const inviter = await this.usersService.findOne(inviterId);
    const friend = await this.usersService.findOne(friendId);
    if (!inviter || !friend) return undefined;
    const checkFriends = await this.friendsNotesRepository.findOneBy({
      user1: inviter,
      user2: friend,
    });
    if (checkFriends) return undefined;
    const invite = this.inviteFriendsRepository.create({
      inviter,
      friend,
    });
    const savedInvite = await this.inviteFriendsRepository.save(invite);
    await this.notificationsService.send(friend.id);
    return savedInvite;
  }

  async findAllByUser(userId: number): Promise<InviteFriends[]> {
    const user = await this.usersService.findOne(userId);
    return this.inviteFriendsRepository.find({
      where: { friend: user },
      relations: ['inviter', 'friend'],
    });
  }

  async remove(inviteId: number, user: User) {
    const invite = await this.inviteFriendsRepository.findOne({
      where: { id: inviteId },
      relations: ['friend'],
    });
    if (!invite) return;
    if (user.id != invite.friend.id) throw new ForbiddenException();
    await this.inviteFriendsRepository.delete(invite);
    await this.notificationsService.send(invite.friend.id);
  }

  async accept(inviteId: number, user: User) {
    const invite = await this.inviteFriendsRepository.findOne({
      where: { id: inviteId },
      relations: ['inviter', 'friend'],
    });
    if (!invite) return;
    if (user.id != invite.friend.id) throw new ForbiddenException();
    const newFriendsNote1 = this.friendsNotesRepository.create({
      user1: invite.inviter,
      user2: invite.friend,
    });
    const newFriendsNote2 = this.friendsNotesRepository.create({
      user1: invite.friend,
      user2: invite.inviter,
    });
    await this.friendsNotesRepository.save(newFriendsNote1);
    await this.friendsNotesRepository.save(newFriendsNote2);
    await this.inviteFriendsRepository.delete(invite);
    await this.notificationsService.send(invite.friend.id);
  }
}

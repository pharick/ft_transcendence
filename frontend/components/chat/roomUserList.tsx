import { FC } from 'react';
import { ChatRoomUser, ChatRoomUserType } from '../../types/interfaces';
import PlayerBlockSmall from '../users/playerBlockSmall';
import styles from '../../styles/RoomUserList.module.css';
import RoomUserButtons from './roomUserButtons';
import Link from 'next/link';

interface RoomUserListProps {
  roomUsers: ChatRoomUser[];
  currentUser?: ChatRoomUser;
  successfulInviteHandler: (invitedUser: ChatRoomUser) => void;
}

const RoomUserList: FC<RoomUserListProps> = ({
  roomUsers,
  currentUser,
  successfulInviteHandler,
}) => {
  return (
    <section>
      <ul className={styles.roomUserList}>
        {roomUsers
          .sort((a, b) => Number(b.isOnline) - Number(a.isOnline))
          .map((roomUser) => (
            <li key={roomUser.id}>
              <article
                className={`${styles.block} ${
                  !roomUser.isOnline ? styles.offline : ''
                }`}
              >
                <Link href={`/users/${roomUser.user.id}`}>
                  <a className={styles.link}>
                    <PlayerBlockSmall
                      user={roomUser.user}
                      showUsername={false}
                    />
                    <p className="m-0 ms-3">
                      {roomUser.user.username}{' '}
                      {roomUser.type == ChatRoomUserType.Owner
                        ? '(owner)'
                        : roomUser.type == ChatRoomUserType.Admin
                        ? '(admin)'
                        : ''}
                    </p>
                  </a>
                </Link>

                {
                  <div className="ms-auto">
                    <RoomUserButtons
                      user={roomUser}
                      currentUser={currentUser}
                      successfulInviteHandler={successfulInviteHandler}
                    />
                  </div>
                }
              </article>
            </li>
          ))}
      </ul>
    </section>
  );
};

export default RoomUserList;

import { FC } from 'react';
import { ChatRoomUser, ChatRoomUserType } from '../../types/interfaces';
import PlayerBlockSmall from '../users/playerBlockSmall';
import styles from '../../styles/RoomUserList.module.css';
import RoomUserButtons from './roomUserButtons';

interface RoomUserListProps {
  roomUsers: ChatRoomUser[];
  currentUser?: ChatRoomUser;
}

const RoomUserList: FC<RoomUserListProps> = ({ roomUsers, currentUser }) => {
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
                <PlayerBlockSmall user={roomUser.user} showUsername={false} />
                <p className="m-0 ms-3">
                  {roomUser.user.username}{' '}
                  {roomUser.type == ChatRoomUserType.Owner
                    ? '(owner)'
                    : roomUser.type == ChatRoomUserType.Admin
                    ? '(admin)'
                    : ''}
                </p>

                {(currentUser?.type == ChatRoomUserType.Owner ||
                  currentUser?.type == ChatRoomUserType.Admin) && (
                  <div className="ms-auto">
                    <RoomUserButtons user={roomUser} />
                  </div>
                )}
              </article>
            </li>
          ))}
      </ul>
    </section>
  );
};

export default RoomUserList;

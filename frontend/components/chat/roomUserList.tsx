import { FC } from 'react';
import { ChatRoomUser } from '../../types/interfaces';
import PlayerBlockSmall from '../users/playerBlockSmall';

import styles from '../../styles/RoomUserList.module.css';

interface RoomUserListProps {
  roomUsers: ChatRoomUser[];
}

const RoomUserList: FC<RoomUserListProps> = ({ roomUsers }) => {
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
                <p className="m-0 ms-3">{roomUser.user.username}</p>
              </article>
            </li>
          ))}
      </ul>
    </section>
  );
};

export default RoomUserList;

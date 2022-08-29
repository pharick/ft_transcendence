import { FC } from 'react';
import { ChatRoomUser, ChatRoomUserType } from '../../types/interfaces';
import PlayerBlockSmall from '../users/playerBlockSmall';
import Image from 'next/image';
import styles from '../../styles/RoomUserList.module.css';
import adminImage from '../../images/admin.svg';
import banImage from '../../images/ban.svg';

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
                  <ul className={styles.buttons}>
                    <li>
                      <button className="icon-button">
                        <Image
                          src={adminImage}
                          alt="Admin"
                          width={20}
                          height={20}
                        />
                      </button>
                    </li>
                    <li>
                      <button className="icon-button">
                        <Image
                          src={banImage}
                          alt="Ban"
                          width={20}
                          height={20}
                        />
                      </button>
                    </li>
                  </ul>
                )}
              </article>
            </li>
          ))}
      </ul>
    </section>
  );
};

export default RoomUserList;

import { FC } from 'react';
import { FriendsNote } from '../../types/interfaces';
import Link from 'next/link';

import styles from '../../styles/CompletedGameList.module.css';
import RemoveFriendButton from './removeFriendsButton';

interface UserFriendsListProps {
  friends: FriendsNote[];
}

const UserFriendsList: FC<UserFriendsListProps> = ({ friends }) => {
  return friends.length > 0 ? (
    <ul className={styles.completedGameList}>
      {friends.map((friend) => (
        <li key={friend.id}>
          <Link href={`/users/${friend.user2.id}`}>
            <a className={styles.link}>
              <article className={styles.card}>
                <div className="row">
                  <div className="col-md d-flex justify-content-center justify-content-md-start align-items-center my-2 my-md-0">
                    <p className={styles.user}>{friend.user2.username}</p>
                    <p className={styles.scores}>{friend.user2.rank}</p>
                  </div>
                </div>
              </article>
            </a>
          </Link>
          <RemoveFriendButton user={friend.user2} />
        </li>
      ))}
    </ul>
  ) : (
    <p>No friends</p>
  );
};

export default UserFriendsList;

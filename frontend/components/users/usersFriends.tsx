import { FC, useContext } from 'react';
import { FriendsNote } from '../../types/interfaces';
import Link from 'next/link';

import styles from '../../styles/CompletedGameList.module.css';
import RemoveFriendButton from './removeFriendsButton';
import PlayerBlockSmall from './playerBlockSmall';
import { UserContext } from './userProvider';

interface UserFriendsListProps {
  friendsNotes: FriendsNote[];
}

const UserFriendsList: FC<UserFriendsListProps> = ({ friendsNotes }) => {
  const userContext = useContext(UserContext);

  return friendsNotes.length > 0 ? (
    <ul className={styles.completedGameList}>
      {friendsNotes.map((note) => (
        <li key={note.id}>
          <Link href={`/users/${note.user2.id}`}>
            <a className={styles.link}>
              <div className="d-flex">
                <div className="flex-grow-1">
                  <article className={styles.card}>
                    <div className="d-flex align-items-center">
                      <div className="me-2">
                        <PlayerBlockSmall
                          user={note.user2}
                          showUsername={false}
                        />
                      </div>
                      <p className={styles.user}>
                        {note.user2.username} (rank {note.user2.rank})
                      </p>
                    </div>
                  </article>
                </div>
                {userContext.user.id == note.user1.id && (
                  <RemoveFriendButton user={note.user2} />
                )}
              </div>
            </a>
          </Link>
        </li>
      ))}
    </ul>
  ) : (
    <p>No friends</p>
  );
};

export default UserFriendsList;

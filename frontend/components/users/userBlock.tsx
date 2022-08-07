import { FC, useContext } from 'react';
import { User } from '../../types/interfaces';
import Image from 'next/image';
import { UserContext } from './userProvider';

import styles from '../../styles/UserBlock.module.css';

interface UserBlockProps {
  user: User;
}

const UserBlock: FC<UserBlockProps> = ({ user }) => {
  const userContext = useContext(UserContext);
  const defaultAvatarUrl = 'static/avatars/default.png';

  let username = user?.username || 'Mr. Wall';
  if (userContext.user?.id == user?.id) username += ' (you)';

  return (
    <article className={styles.userBlock}>
      <div className={styles.avatar}>
        <Image
          src={`${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/${
            user?.avatar || defaultAvatarUrl
          }`}
          width={250}
          height={250}
          alt={username}
        />
        {user && <p className={styles.rank}>{user.rank}</p>}
      </div>
      <p className={styles.username}>{user ? `${username}` : 'Mr. Wall'}</p>
    </article>
  );
};

export default UserBlock;

import { FC, useContext, useEffect, useState } from 'react';
import { User, UserStatus, UserStatusInterface } from '../../types/interfaces';
import Image from 'next/image';
import { UserContext } from './userProvider';

import styles from '../../styles/UserBlock.module.css';
import { fetchWithHandleErrors } from '../../utils';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';

interface UserBlockProps {
  user: User;
}

const UserBlock: FC<UserBlockProps> = ({ user }) => {
  const userContext = useContext(UserContext);
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);
  const [status, setStatus] = useState<UserStatus>();

  const defaultAvatarUrl = 'static/avatars/default.png';

  useEffect(() => {
    const getStatus = async () => {
      const response = await fetchWithHandleErrors({
        requestErrorHandlerContext,
        url: `/api/status/${user.id}`,
      });
      const data: UserStatusInterface = await response.json();
      setStatus(data.status);
    };
    getStatus().then();
  }, [user, userContext.user]);

  let username = user.username;
  if (userContext.user?.id == user.id) username += ' (you)';

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
      <p className={styles.username}>{username}</p>
      <div className={styles.status}>
        <div
          className={`${styles.statusCircle} ${
            status == UserStatus.Online
              ? styles.online
              : status == UserStatus.InGame
              ? styles.inGame
              : styles.offline
          }`}
        ></div>
        <p>{status}</p>
      </div>
    </article>
  );
};

export default UserBlock;

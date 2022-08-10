import React, { FC, useContext } from 'react';
import { Player } from '../../types/interfaces';
import Image from 'next/image';
import { UserContext } from './userProvider';

import styles from '../../styles/UserBlockSmall.module.css';

interface PlayerBlockSmallProps {
  user: Player;
  showUsername?: boolean;
}

const PlayerBlockSmall: FC<PlayerBlockSmallProps> = ({
  user,
  showUsername,
}) => {
  const userContext = useContext(UserContext);
  const defaultAvatarUrl = 'static/avatars/default.png';

  return (
    <article className={styles.block}>
      <div className={styles.avatar}>
        <Image
          src={`${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/${
            user?.avatar || defaultAvatarUrl
          }`}
          width={50}
          height={50}
          alt={user?.username || 'Anonymous'}
        />
      </div>
      {(showUsername || showUsername == undefined) && (
        <p className={styles.username}>{`${user?.username || 'Anonymous'}${
          user && userContext.user?.id == user?.id ? ' (you)' : ''
        }`}</p>
      )}
    </article>
  );
};

export default PlayerBlockSmall;

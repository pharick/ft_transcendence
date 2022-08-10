import React, { FC } from 'react';
import { Player } from '../../types/interfaces';
import PlayerBlockSmall from '../users/playerBlockSmall';

import styles from '../../styles/WatcherList.module.css';

interface WatcherListProps {
  watchers: Player[];
}

const WatcherList: FC<WatcherListProps> = ({ watchers }) => {
  return (
    <section className={styles.watcherListSection}>
      <p>{watchers.length} users watching game</p>
      <ul className={styles.watcherList}>
        {watchers.map((user) => (
          <li className={styles.item}>
            <PlayerBlockSmall user={user} showUsername={false} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default WatcherList;

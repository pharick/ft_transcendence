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
      <h2 className="mt-0">{watchers.length} users watching game</h2>
      <ul className={styles.watcherList}>
        {watchers.map((user, index) => (
          <li key={index} className={styles.item}>
            <PlayerBlockSmall user={user} showUsername={false} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default WatcherList;

import { FC } from 'react';
import { CompletedGame } from '../../types/interfaces';
import Link from 'next/link';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

import styles from '../../styles/CompletedGameList.module.css';

interface CompletedGameListProps {
  games: CompletedGame[];
}

const CompletedGameList: FC<CompletedGameListProps> = ({ games }) => {
  return games.length > 0 ? (
    <ul className={styles.completedGameList}>
      {games.map((game) => (
        <li key={game.id}>
          <Link href={`/completed/${game.id}`}>
            <a className={styles.link}>
              <article className={styles.card}>
                <div className="row">
                  <div className="col-md-auto">
                    {format(
                      utcToZonedTime(game.date, 'Europe/Moscow'),
                      'dd.MM.yyyy H:mm:ss',
                    )}
                  </div>
                  <div className="col-md d-flex justify-content-center justify-content-md-start align-items-center my-2 my-md-0">
                    <p className={styles.user}>{game.player1.username}</p>
                    <p className={styles.scores}>{game.score1}</p>
                    <p className={styles.scores}>—</p>
                    <p className={styles.scores}>{game.score2}</p>
                    <p className={styles.user}>{game.player2.username}</p>
                  </div>
                  <div className="col-md-auto">{game.duration}s</div>
                  <div className="col-md-auto">
                    <b>{game.isRanked ? 'Ranked' : 'Not Ranked'}</b>
                  </div>
                </div>
              </article>
            </a>
          </Link>
        </li>
      ))}
    </ul>
  ) : (
    <p>No completed games</p>
  );
};

export default CompletedGameList;

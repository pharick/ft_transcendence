import type { GetServerSideProps, NextPage } from 'next';

import { CompletedGame } from '../../types/interfaces';
import Head from 'next/head';
import UserBlock from '../../components/users/userBlock';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

import styles from '../../styles/CompletedGamePage.module.css';

interface CompletedGamePageProps {
  completedGameInfo: CompletedGame;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const completedGameId = context.params?.completedGameId;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/completed/${completedGameId}`,
  );
  if (response.status == 404) return { notFound: true };
  const completedGameInfo: CompletedGame = await response.json();
  return { props: { completedGameInfo } };
};

const CompletedGamePage: NextPage<CompletedGamePageProps> = ({
  completedGameInfo,
}) => {
  return (
    <>
      <Head>
        <title>
          Game {completedGameInfo.player1.username} vs.{' '}
          {completedGameInfo.player2.username} is completed
        </title>
      </Head>

      <h1 className="text-center">
        Game <b>{completedGameInfo.player1.username}</b> vs.{' '}
        <b>{completedGameInfo.player2.username}</b> is completed
      </h1>

      <div className={styles.scores}>
        <div className={styles.part}>
          <UserBlock user={completedGameInfo.player1} />
          <p className={styles.score}>{completedGameInfo.score1}</p>
        </div>
        <div className={styles.part}>
          <UserBlock user={completedGameInfo.player2} />
          <p className={styles.score}>{completedGameInfo.score2}</p>
        </div>
      </div>

      <ul className={styles.meta}>
        <li className={styles.metaItem}>
          <b>Date:</b>{' '}
          {format(
            utcToZonedTime(completedGameInfo.date, 'Europe/Moscow'),
            'dd.MM.yyyy H:mm:ss',
          )}
        </li>
        <li className={styles.metaItem}>
          <b>Duration:</b> {completedGameInfo.duration}s
        </li>
      </ul>
    </>
  );
};

export default CompletedGamePage;

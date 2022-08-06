import type { GetServerSideProps, NextPage } from 'next';

import { CompletedGame } from '../../types/interfaces';
import Head from 'next/head';
import UserBlock from '../../components/users/userBlock';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

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
          {' '}
          Game {completedGameInfo.player1.username} vs.{' '}
          {completedGameInfo.player2?.username || 'Mr.Wall'} is completed
        </title>
      </Head>

      <h1 className="text-center">
        Game <b>{completedGameInfo.player1.username}</b> vs.{' '}
        <b>{completedGameInfo.player2?.username || 'Mr.Wall'}</b> is completed
      </h1>

      <div className="completed-game-scores">
        <div className="completed-game-part">
          <UserBlock user={completedGameInfo.player1} />
          <p className="completed-game-score">{completedGameInfo.score1}</p>
        </div>
        <div className="completed-game-part">
          <UserBlock user={completedGameInfo.player2} />
          <p className="completed-game-score">{completedGameInfo.score2}</p>
        </div>
      </div>

      <p>Duration: {completedGameInfo.duration}s</p>
      <p>
        Date:{' '}
        {format(
          utcToZonedTime(completedGameInfo.date, 'Europe/Moscow'),
          'dd.MM.yyyy H:mm:ss',
        )}
      </p>
    </>
  );
};

export default CompletedGamePage;

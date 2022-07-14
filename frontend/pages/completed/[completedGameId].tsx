import type { GetServerSideProps, NextPage } from 'next';

import { CompletedGameInfo } from '../../types/interfaces';
import Head from 'next/head';
import PlayerBlock from '../../components/playerBlock';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

interface CompletedGamePageProps {
  completedGameInfo: CompletedGameInfo;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const completedGameId = context.params?.completedGameId;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/completed/${completedGameId}`,
  );
  if (response.status == 404) return { notFound: true };
  const completedGameInfo: CompletedGameInfo = await response.json();
  return { props: { completedGameInfo } };
};

const CompletedGamePage: NextPage<CompletedGamePageProps> = ({ completedGameInfo }) => {
  return (
    <>
      <Head>
        <title>
          Game {completedGameInfo.hostUser ? completedGameInfo.hostUser.username : 'Mr. Wall'} vs. {completedGameInfo.guestUser ? completedGameInfo.guestUser.username : 'Mr.Wall'} is
          completed
        </title>
      </Head>

      <h1 className='text-center'>
        Game <b>{completedGameInfo.hostUser ? completedGameInfo.hostUser.username : 'Mr. Wall'}</b> vs. <b>{completedGameInfo.guestUser ? completedGameInfo.guestUser.username : 'Mr.Wall'}</b> is
        completed
      </h1>

      <div className='completed-game-scores'>
        <div className='completed-game-part'>
          <PlayerBlock user={completedGameInfo.hostUser} />
          <p className='completed-game-score'>{completedGameInfo.score1}</p>
        </div>
        <div className='completed-game-part'>
          <PlayerBlock user={completedGameInfo.guestUser} />
          <p className='completed-game-score'>{completedGameInfo.score2}</p>
        </div>
      </div>

      <p>Duration: {completedGameInfo.duration}s</p>
      <p>Date: {format(utcToZonedTime(completedGameInfo.date, 'Europe/Moscow'), 'dd.MM.yyyy h:mm:ss')}</p>
    </>
  );
};

export default CompletedGamePage;

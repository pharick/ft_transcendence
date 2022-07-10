import type { GetServerSideProps, NextPage } from 'next';

import { CompletedGameInfo } from '../../types/interfaces';
import Head from 'next/head';
import PlayerBlock from '../../components/playerBlock';

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

const CompletedGamePage: NextPage<CompletedGamePageProps> = ({ completedGameInfo}) => {
  return (
    <>
      <Head>
        <title>
          Game {completedGameInfo.hostUser ? completedGameInfo.hostUser.username : 'Mr. Wall'} vs. {completedGameInfo.guestUser ? completedGameInfo.guestUser.username : 'Mr.Wall'} is
          completed
        </title>
      </Head>

      <h1 className='text-center'>
        Game <b>{completedGameInfo.hostUser.username}</b> vs. <b>{completedGameInfo.guestUser.username}</b> is completed
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
    </>
  );
};

export default CompletedGamePage;

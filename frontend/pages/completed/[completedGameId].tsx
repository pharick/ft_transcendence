import type { GetServerSideProps, NextPage } from 'next';

import { CompletedGameInfo } from '../../types/interfaces';
import Head from 'next/head';

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
  console.log(completedGameInfo);
  return { props: { completedGameInfo } };
};

const CompletedGamePage: NextPage<CompletedGamePageProps> = ({
  completedGameInfo,
}) => {
  return (
    <>
      <Head>
        <title>
          Game {completedGameInfo.hostUser ? completedGameInfo.hostUser.username : 'Mr. Wall'} vs. {completedGameInfo.guestUser ? completedGameInfo.guestUser.username : 'Mr.Wall'} is completed
        </title>
      </Head>

      <h1 className="text-center">
        Game{' '}
        <b>
          {completedGameInfo.hostUser
            ? completedGameInfo.hostUser.username
            : 'Mr. Wall'}
        </b>{' '}
        vs.{' '}
        <b>
          {completedGameInfo.guestUser
            ? completedGameInfo.guestUser.username
            : 'Mr.Wall'}
        </b>{' '}
        is completed
      </h1>

      <div className="completed-game-scores">
        <div className="completed-game-part">
          <div className="avatar-placeholder"></div>
          <p className="completed-game-score">{completedGameInfo.score1}</p>
          <p className="completed-game-player">{completedGameInfo.hostUser ? completedGameInfo.hostUser.username : 'Mr. Wall'}</p>
        </div>
        <div className="completed-game-part">
          <div className="avatar-placeholder"></div>
          <p className="completed-game-score">{completedGameInfo.score2}</p>
          <p className="completed-game-player">{completedGameInfo.guestUser ? completedGameInfo.guestUser.username : 'Mr. Wall'}</p>
        </div>
      </div>
    </>
  );
};

export default CompletedGamePage;

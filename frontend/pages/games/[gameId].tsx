import type { NextPage } from 'next';
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

const Pong = dynamic(() => import('../../components/pong'), { ssr: false });

const Game: NextPage = () => {
  const router = useRouter();
  const gameId = Array.isArray(router.query.gameId) ? router.query.gameId[0] : router.query.gameId;

  return (
    <>
      <h1>Game {gameId}</h1>
      {gameId && <Pong gameId={gameId} />}
    </>
  );
};

export default Game;

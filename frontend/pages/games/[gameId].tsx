import type { NextPage } from 'next';
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

const Pong = dynamic(() => import('../../components/pong'), { ssr: false });

const Game: NextPage = () => {
  const router = useRouter();
  const { gameId }: { gameId: string } = router.query;

  return (
    <>
      <h1>Game {gameId}</h1>
      {gameId && <Pong gameId={gameId} />}
    </>
  );
};

export default Game;

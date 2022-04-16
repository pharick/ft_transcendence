import type { NextPage } from 'next';
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

const Pong = dynamic(() => import('../../components/pong'), { ssr: false });

const Game: NextPage = () => {
  const router = useRouter();
  const { game_id } = router.query;

  return (
    <>
      <h1>Game {game_id}</h1>
      <Pong game_id={game_id} />
    </>
  );
};

export default Game;

import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { GameInfo } from '../../types/interfaces';

// import { userContext } from '../../components/userProvider';

interface GamesPageProps {
  games: GameInfo[],
}

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await fetch(`http://localhost:3000/api/games`);
  const games: GameInfo[] = await response.json();
  return { props: { games } };
};

const HomePage: NextPage<GamesPageProps> = ({ games }) => {
  return (
    <ul className="game-list">
      {games.map((game) => (
        <li key={game.gameId}>
          <article className="game-card">
            <div className="game-card-part">
              <p className="game-card-score">{game.scores.player1}</p>
              <p className="game-card-player">{game.player1.username}</p>
            </div>
            <div className="game-card-part">
              <p className="game-card-score">{game.scores.player1}</p>
              <p className="game-card-player">{game.player2.username}</p>
            </div>
          </article>
        </li>
      ))}

      <li>
        <article className="game-card">
          <div className="game-card-part">
            <p className="game-card-score">1234</p>
            <p className="game-card-player">foo</p>
          </div>
          <div className="game-card-part">
            <p className="game-card-score">1234</p>
            <p className="game-card-player">bar</p>
          </div>
        </article>
      </li>
    </ul>
  );
};

export default HomePage;

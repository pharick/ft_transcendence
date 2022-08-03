import { FC, useContext } from 'react';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { fetchWithHandleErrors } from '../../utils';
import { Game } from '../../types/interfaces';

const TrainingGameButton: FC = () => {
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);

  const handleCreateGame = async () => {
    const gameResponse = await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: '/api/games/',
      method: 'PUT',
      authRequired: true,
    });
    if (gameResponse?.ok) {
      const game: Game = await gameResponse.json();
      console.log(`New trainig game created: ${game.id}`);
    }
  };

  return <button onClick={handleCreateGame}>Start training game</button>;
};

export default TrainingGameButton;

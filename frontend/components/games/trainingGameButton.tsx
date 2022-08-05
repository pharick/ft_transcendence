import React, { FC, useContext } from 'react';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { fetchWithHandleErrors } from '../../utils';
import { Game } from '../../types/interfaces';
import trainingImage from '../../images/training.svg';
import Image from 'next/image';

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

  return (
    <button className="image-button" onClick={handleCreateGame}>
      <Image src={trainingImage} layout="responsive" />
      <span>Play training game</span>
    </button>
  );
};

export default TrainingGameButton;

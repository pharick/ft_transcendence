import React, { FC, useContext } from 'react';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { fetchWithHandleErrors } from '../../utils';
import { Game } from '../../types/interfaces';
import trainingImage from '../../images/training.svg';
import Image from 'next/image';
import { useRouter } from 'next/router';

const TrainingGameButton: FC = () => {
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);
  const router = useRouter();

  const handleCreateGame = async () => {
    const gameResponse = await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: '/api/games/',
      method: 'PUT',
      authRequired: true,
    });
    if (gameResponse?.ok) {
      const game: Game = await gameResponse.json();
      await router.push(`/games/${game.id}`);
    }
  };

  return (
    <button className="image-button" onClick={handleCreateGame}>
      <Image src={trainingImage} width={100} height={100} />
      <span>Play training game</span>
    </button>
  );
};

export default TrainingGameButton;

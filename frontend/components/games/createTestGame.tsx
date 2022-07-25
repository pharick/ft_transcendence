import { FC } from 'react';

const TrainingModeButton: FC = () => {
  const handleCreateGame = async () => {
    const response = await fetch('/api/games/', {
      method: 'PUT',
    });
  };

  return <button onClick={handleCreateGame}>Training mode</button>;
};

export default TrainingModeButton;

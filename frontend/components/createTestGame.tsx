import { FC } from 'react';

const TrainingModeButton: FC = () => {
  const handleCreateGame = async () => {
    const response = await fetch('/api/games/', {
      method: 'PUT',
    });
    const data = await response.json();
    console.log(data);
  };

  return <button onClick={handleCreateGame}>Training mode</button>;
};

export default TrainingModeButton;

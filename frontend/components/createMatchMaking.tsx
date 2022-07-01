import { FC } from 'react';

const MatchMakingModeButton: FC = () => {
  const createGame = async () => {
    const response = await fetch('/api/matchMaking', {
      method: 'PUT',
    });
    const data = await response.json();
  }
  return <button onClick={createGame}>Play with someone</button>;
};

export default MatchMakingModeButton;

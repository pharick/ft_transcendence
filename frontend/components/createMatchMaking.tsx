import { FC } from 'react';

const MatchMakingModeButton: FC = () => {
  const createGame = async () => { // Post запрос
    const response = await fetch('/api/games/', {
      method: 'PUT',
    });
    const data = await response.json();
    //console.log('Matching')
    //console.log(data)
  }
  return <button onClick={createGame}>Play with someone</button>;
};

export default MatchMakingModeButton;

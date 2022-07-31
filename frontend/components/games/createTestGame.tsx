import { FC, useContext } from 'react';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { fetchWithHandleErrors } from '../../utils';

const TrainingModeButton: FC = () => {
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);

  const handleCreateGame = async () => {
    await fetchWithHandleErrors(
      requestErrorHandlerContext,
      '/api/games/',
      true,
      'PUT',
    );
  };

  return (
    <>
      <button onClick={handleCreateGame}>Training mode</button>
    </>
  );
};

export default TrainingModeButton;

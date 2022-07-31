import { FC, useContext } from 'react';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';

const TrainingModeButton: FC = () => {
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext)

  const handleCreateGame = async () => {
    await requestErrorHandlerContext.requestErrorHandler(async () => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 2000);
      return await fetch('/api/games/', {
        method: 'PUT',
        signal: controller.signal,
      });
    });
  };

  return (
    <>
      <button onClick={handleCreateGame}>Training mode</button>
    </>
  );
};

export default TrainingModeButton;

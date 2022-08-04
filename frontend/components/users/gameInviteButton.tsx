import { FC, useContext, useState } from 'react';
import { User } from '../../types/interfaces';
import { CreatePendingGameDto } from '../../types/dtos';
import { fetchWithHandleErrors } from '../../utils';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';

interface InviteProps {
  user: User;
}

const GameInviteButton: FC<InviteProps> = ({ user }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);

  const handleGameInvite = async () => {
    const createPendingGameDto: CreatePendingGameDto = {
      player2Id: user.id,
    };

    const response = await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: '/api/pending/',
      method: 'PUT',
      body: createPendingGameDto,
      authRequired: true,
    });

    if (response?.status == 409) setIsError(true);
    if (response?.status == 200) setIsSuccess(true);
  };

  const className = isSuccess
    ? 'success-button'
    : isError
    ? 'error-button'
    : '';
  const text = isSuccess
    ? 'Invited'
    : isError
    ? 'Already invited'
    : 'Invite to the game';

  return (
    <button
      disabled={isSuccess || isError}
      className={className}
      onClick={handleGameInvite}
    >
      {text}
    </button>
  );
};

export default GameInviteButton;

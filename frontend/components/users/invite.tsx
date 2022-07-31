import { FC, useContext, useState } from 'react';
import { UserInfo } from '../../types/interfaces';
import { CreatePendingGameDto } from '../../types/dtos';
import { fetchWithHandleErrors } from '../../utils';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';

interface InviteProps {
  userInfo: UserInfo;
}

const Invite: FC<InviteProps> = ({ userInfo }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);

  const handleGameInvite = async () => {
    const createPendingGameDto: CreatePendingGameDto = {
      guestUserId: userInfo.id,
    };

    const response = await fetchWithHandleErrors(
      requestErrorHandlerContext,
      '/api/pending/',
      true,
      'PUT',
      {
        'Content-Type': 'application/json',
      },
      JSON.stringify(createPendingGameDto),
    );

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

export default Invite;

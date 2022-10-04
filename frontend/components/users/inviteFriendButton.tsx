import { FC, useContext, useState } from 'react';
import { fetchWithHandleErrors } from '../../utils';
import { User } from '../../types/interfaces';
import Image from 'next/image';
import pingpong from '../../images/pingpong.svg';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { CreateInviteFriendDto } from '../../types/dtos';

interface InviteFriendButtonProps {
  user: User;
}

const InviteFriendButton: FC<InviteFriendButtonProps> = ({ user }) => {
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const className = isSuccess
    ? 'success-button'
    : isError
    ? 'error-button'
    : '';
  const text = isSuccess
    ? 'Invited'
    : isError
    ? 'Already invited'
    : 'Invite to friends';

  const handleInvite = async () => {
    const dto: CreateInviteFriendDto = { friendId: user.id };
    const response = await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: '/api/friends/invites',
      body: dto,
      method: 'PUT',
      ignoreCodes: [409],
    });
    if (response.ok) {
      setIsSuccess(true);
    } else {
      setIsError(true);
    }
  };

  return (
    <>
      <button
        disabled={isSuccess || isError}
        className={`${className} icon-button`}
        onClick={handleInvite}
      >
        <Image src={pingpong} alt={text} width={25} height={25} />
        {text}
      </button>
    </>
  );
};

export default InviteFriendButton;

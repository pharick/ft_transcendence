import { FC, useState } from 'react';
import { UserInfo } from '../types/interfaces';
import { CreatePendingGameDto } from '../types/dtos';

interface InviteProps {
  currentUser?: UserInfo;
  userInfo: UserInfo;
}

const Invite: FC<InviteProps> = ({ currentUser, userInfo }) => {
  const [isDisabled, setIsDisabled] = useState(false);

  const handleGameInvite = async () => {
    const createPendingGameDto: CreatePendingGameDto = {
      guestUserId: userInfo.id,
    };

    const response = await fetch('/api/pending/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createPendingGameDto),
    });

    if (response.status == 409)
      setIsDisabled(true);
  };

  return (
    <>
      {currentUser?.id == userInfo.id ? (
        <p>It&apos;s me</p>
      ) : (
        <button disabled={isDisabled} className={isDisabled ? 'error-button' : ''} onClick={handleGameInvite}>
          {!isDisabled ? 'Invite to the game' : 'Already invited'}
        </button>
      )}
    </>
  );
};

export default Invite;

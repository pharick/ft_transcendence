import { FC, useContext, useState } from 'react';
import { fetchWithHandleErrors } from '../../utils';
import { User } from '../../types/interfaces';
import Image from 'next/image';
import pingpong from '../../images/pingpong.svg';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';

interface RemoveFriendButtonProps {
  user: User;
}

const RemoveFriendButton: FC<RemoveFriendButtonProps> = ({ user }) => {
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);

  const handleRemove = async (userId: number) => {
    await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: `/api/friends/${userId}`,
      method: 'DELETE',
    });
  };

  return (
    <>
      <button
        className={`icon-button`}
        onClick={() => {
          handleRemove(user.id).then();
        }}
      >
        Remove
      </button>
    </>
  );
};

export default RemoveFriendButton;

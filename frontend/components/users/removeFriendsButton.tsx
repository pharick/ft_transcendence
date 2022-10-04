import { FC, useContext } from 'react';
import { fetchWithHandleErrors } from '../../utils';
import { User } from '../../types/interfaces';
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
        className="error-button my-3 mx-0"
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

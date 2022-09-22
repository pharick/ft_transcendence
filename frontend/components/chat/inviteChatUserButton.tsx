import { FC, useContext, useState } from 'react';
import UserSearchListModal from '../users/userSearchListModal';
import { ChatRoom, User } from '../../types/interfaces';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { fetchWithHandleErrors } from '../../utils';
import { InviteChatUserDto } from '../../types/dtos';

interface InviteChatUserButtonProps {
  room: ChatRoom;
}

const InviteChatUserButton: FC<InviteChatUserButtonProps> = ({ room }) => {
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);
  const [modalOpen, setModalOpen] = useState(false);

  const handleInvite = async (user: User) => {
    const data: InviteChatUserDto = {
      userId: user.id,
    };
    const response = await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: `/api/chat/rooms/${room.id}/invite`,
      method: 'PUT',
      body: data,
      authRequired: true,
    });
    console.log(response);
    return true;
  };

  return (
    <>
      <button
        onClick={() => {
          setModalOpen(true);
        }}
      >
        Invite user
      </button>
      <UserSearchListModal
        isOpen={modalOpen}
        title="Invite user to chat room"
        cancelButtonHandler={() => {
          setModalOpen(false);
        }}
        actionButtonText="Invite"
        actionButtonHandler={handleInvite}
      />
    </>
  );
};

export default InviteChatUserButton;

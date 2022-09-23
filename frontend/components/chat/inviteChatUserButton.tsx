import { FC, useContext, useEffect, useState } from 'react';
import UserSearchListModal from '../users/userSearchListModal';
import { ChatRoom, ChatRoomUser, User } from '../../types/interfaces';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { fetchWithHandleErrors } from '../../utils';
import { InviteChatUserDto } from '../../types/dtos';

interface InviteChatUserButtonProps {
  room: ChatRoom;
  roomUsers: ChatRoomUser[];
}

const InviteChatUserButton: FC<InviteChatUserButtonProps> = ({
  room,
  roomUsers,
}) => {
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch(`/api/users`);
      const allUsers: User[] = await response.json();
      const inRoomUsersIds = roomUsers.map((roomUser) => roomUser.user.id);
      const nonRoomUsers = allUsers.filter(
        (user) => !inRoomUsersIds.includes(user.id),
      );
      setUsers(nonRoomUsers);
    };
    getUsers().then();
  }, [room, roomUsers]);

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
        users={users}
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

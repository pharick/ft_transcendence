import { FC, useContext, useState } from 'react';
import {
  ChatRoom,
  ChatRoomUser,
  ChatRoomUserType,
  DropdownItem,
} from '../../types/interfaces';
import Dropdown from '../layout/dropdown';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { fetchWithHandleErrors } from '../../utils';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BanChatUserDto, MuteChatUserDto } from '../../types/dtos';
import GameInviteModal from '../games/gameInviteModal';

const Modal = dynamic(() => import('../../components/layout/modal'), {
  ssr: false,
});

interface RoomUserButtonsProps {
  room: ChatRoom;
  user: ChatRoomUser;
  currentUser: ChatRoomUser;
  successfulInviteHandler: (invitedUser: ChatRoomUser) => void;
}

const RoomUserButtons: FC<RoomUserButtonsProps> = ({
  room,
  user,
  currentUser,
  successfulInviteHandler,
}) => {
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [muteModalOpen, setMuteModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const banDurationForm = useForm<BanChatUserDto>();
  const muteDurationForm = useForm<MuteChatUserDto>();
  const router = useRouter();

  const handleAdmin = async () => {
    const url =
      user.type != ChatRoomUserType.Admin
        ? `/api/chat/users/${room.id}/users/${user.id}/makeAdmin`
        : `/api/chat/users/${user.id}/revokeAdmin`;
    await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url,
      method: 'POST',
      authRequired: true,
    });
    router.reload();
  };

  const handleBan: SubmitHandler<BanChatUserDto> = async (data) => {
    await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: `/api/chat/users/${room.id}/users/${user.id}/ban`,
      method: 'POST',
      body: data,
      authRequired: true,
    });
    setBanModalOpen(false);
  };

  const handleMute: SubmitHandler<MuteChatUserDto> = async (data) => {
    await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: `/api/chat/users/${room.id}/users/${user.id}/mute`,
      method: 'POST',
      body: data,
      authRequired: true,
    });
    setMuteModalOpen(false);
  };

  const menu: DropdownItem[] = [];
  if (user.id != currentUser.id) {
    menu.push({
      text: 'Invite to game',
      callback: () => {
        setInviteModalOpen(true);
      },
    });
  }
  if (
    (currentUser?.type == ChatRoomUserType.Owner ||
      currentUser?.type == ChatRoomUserType.Admin) &&
    currentUser.id != user.id &&
    user.type != ChatRoomUserType.Owner
  ) {
    menu.push(
      {
        text:
          user.type == ChatRoomUserType.Admin ? 'Revoke Admin' : 'Make admin',
        callback: handleAdmin,
      },
      {
        text: 'Ban',
        callback: () => {
          setBanModalOpen(true);
        },
      },
      {
        text: 'Mute',
        callback: () => {
          setMuteModalOpen(true);
        },
      },
    );
  }

  return (
    <>
      {menu.length > 0 && <Dropdown menu={menu} />}

      <Modal
        isOpen={banModalOpen}
        title="Ban chat user"
        cancelButtonText="Cancel"
        cancelButtonHandler={() => {
          setBanModalOpen(false);
        }}
      >
        <form
          className="d-flex"
          onSubmit={banDurationForm.handleSubmit(handleBan)}
        >
          <input
            className="flex-grow-1"
            type="number"
            min="1"
            placeholder="Duration in minutes"
            {...banDurationForm.register('durationMin', { required: true })}
          />
          <button type="submit">Block</button>
        </form>
      </Modal>

      <Modal
        isOpen={muteModalOpen}
        title="Mute char user"
        cancelButtonText="Cancel"
        cancelButtonHandler={() => {
          setMuteModalOpen(false);
        }}
      >
        <form
          className="d-flex"
          onSubmit={muteDurationForm.handleSubmit(handleMute)}
        >
          <input
            className="flex-grow-1"
            type="number"
            min="1"
            placeholder="Duration in minutes"
            {...muteDurationForm.register('durationMin', { required: true })}
          />
          <button type="submit">Mute</button>
        </form>
      </Modal>

      <GameInviteModal
        isOpen={inviteModalOpen}
        cancelButtonHandler={() => {
          setInviteModalOpen(false);
        }}
        user={user.user}
        setIsSuccess={() => {
          successfulInviteHandler(user);
        }}
      />
    </>
  );
};

export default RoomUserButtons;

import { FC, useContext, useState } from 'react';
import { ChatRoomUser, ChatRoomUserType } from '../../types/interfaces';
import Dropdown from '../layout/dropdown';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { fetchWithHandleErrors } from '../../utils';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BanChatUserDto, MuteChatUserDto } from '../../types/dtos';

const Modal = dynamic(() => import('../../components/layout/modal'), {
  ssr: false,
});

interface RoomUserButtonsProps {
  user: ChatRoomUser;
}

const RoomUserButtons: FC<RoomUserButtonsProps> = ({ user }) => {
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [muteModalOpen, setMuteModalOpen] = useState(false);
  const banDurationForm = useForm<BanChatUserDto>();
  const muteDurationForm = useForm<MuteChatUserDto>();
  const router = useRouter();

  const handleAdmin = async () => {
    const url =
      user.type != ChatRoomUserType.Admin
        ? `/api/chat/users/${user.id}/makeAdmin`
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
      url: `/api/chat/users/${user.id}/ban`,
      method: 'POST',
      body: data,
      authRequired: true,
    });
    setBanModalOpen(false);
  };

  const handleMute: SubmitHandler<MuteChatUserDto> = async (data) => {
    await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: `/api/chat/users/${user.id}/mute`,
      method: 'POST',
      body: data,
      authRequired: true,
    });
    setMuteModalOpen(false);
  };

  return (
    <>
      <Dropdown
        menu={[
          {
            text:
              user.type == ChatRoomUserType.Admin
                ? 'Revoke Admin'
                : 'Make admin',
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
        ]}
      />

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
    </>
  );
};

export default RoomUserButtons;

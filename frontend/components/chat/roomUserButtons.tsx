import { FC, useContext, useState } from 'react';
import { ChatRoomUser, ChatRoomUserType } from '../../types/interfaces';
import Dropdown from '../layout/dropdown';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { fetchWithHandleErrors } from '../../utils';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BlockChatUserDto, MuteChatUserDto } from '../../types/dtos';

const Modal = dynamic(() => import('../../components/layout/modal'), {
  ssr: false,
});

interface RoomUserButtonsProps {
  user: ChatRoomUser;
}

const RoomUserButtons: FC<RoomUserButtonsProps> = ({ user }) => {
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [muteModalOpen, setMuteModalOpen] = useState(false);
  const blockDurationForm = useForm<BlockChatUserDto>();
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

  const handleBlock: SubmitHandler<BlockChatUserDto> = async (data) => {
    await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: `/api/chat/users/${user.id}/block`,
      method: 'POST',
      body: data,
      authRequired: true,
    });
  };

  const handleMute: SubmitHandler<MuteChatUserDto> = async (data) => {
    await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: `/api/chat/users/${user.id}/mute`,
      method: 'POST',
      body: data,
      authRequired: true,
    });
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
            text: 'Block',
            callback: () => {
              setBlockModalOpen(true);
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
        isOpen={blockModalOpen}
        title="Block Chat User"
        cancelButtonText="Cancel"
        cancelButtonHandler={() => {
          setBlockModalOpen(false);
        }}
      >
        <form
          className="d-flex"
          onSubmit={blockDurationForm.handleSubmit(handleBlock)}
        >
          <input
            className="flex-grow-1"
            type="number"
            min="1"
            placeholder="Duration in minutes"
            {...blockDurationForm.register('durationMin', { required: true })}
          />
          <button type="submit">Block</button>
        </form>
      </Modal>

      <Modal
        isOpen={muteModalOpen}
        title="Mute Chat User"
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
          <button type="submit">Block</button>
        </form>
      </Modal>
    </>
  );
};

export default RoomUserButtons;

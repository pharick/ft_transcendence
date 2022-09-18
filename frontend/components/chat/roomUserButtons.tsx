import { FC, useContext } from 'react';
import { ChatRoomUser, ChatRoomUserType } from '../../types/interfaces';
import Dropdown from '../layout/dropdown';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { fetchWithHandleErrors } from '../../utils';
import { useRouter } from 'next/router';

interface RoomUserButtonsProps {
  user: ChatRoomUser;
}

const RoomUserButtons: FC<RoomUserButtonsProps> = ({ user }) => {
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);
  const router = useRouter();

  const handleMakeAdmin = async () => {
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

  return (
    <Dropdown
      menu={[
        {
          text:
            user.type == ChatRoomUserType.Admin ? 'Revoke Admin' : 'Make admin',
          callback: handleMakeAdmin,
        },
        { text: 'Block', callback: () => {} },
        { text: 'Mute', callback: () => {} },
      ]}
    />
  );
};

export default RoomUserButtons;

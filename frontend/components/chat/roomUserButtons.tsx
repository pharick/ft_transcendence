import { FC, useContext } from 'react';
import { ChatRoomUser } from '../../types/interfaces';
import Dropdown from '../layout/dropdown';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { fetchWithHandleErrors } from '../../utils';

interface RoomUserButtonsProps {
  user: ChatRoomUser;
}

const RoomUserButtons: FC<RoomUserButtonsProps> = ({ user }) => {
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);

  const handleMakeAdmin = async () => {
    const response = await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: `/api/chat/users/${user.id}/makeAdmin`,
      method: 'POST',
      authRequired: true,
    });
    if (response.ok) {
      console.log('admin');
    }
  };

  return (
    <Dropdown
      menu={[
        { text: 'Make admin', callback: handleMakeAdmin },
        { text: 'Block', callback: () => {} },
        { text: 'Mute', callback: () => {} },
      ]}
    />
  );
};

export default RoomUserButtons;

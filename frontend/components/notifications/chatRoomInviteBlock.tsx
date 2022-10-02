import { FC, useContext } from 'react';
import { ChatRoomInvite } from '../../types/interfaces';

import styles from '../../styles/Notifications.module.css';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { fetchWithHandleErrors } from '../../utils';

interface ChatRoomInviteBlockProps {
  invite: ChatRoomInvite;
}

const ChatRoomInviteBlock: FC<ChatRoomInviteBlockProps> = ({ invite }) => {
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);

  const handleAccept = async (inviteId: number) => {};

  const handleRemove = async (inviteId: number) => {
    await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: `/api/chat/rooms/invites/${inviteId}`,
      method: 'DELETE',
    });
  };

  return (
    <article className={styles.block}>
      <p>
        <b>{invite.inviter.username}</b> invites you to{' '}
        <b>"{invite.room.name}"</b> chat room
      </p>
      <div>
        <button
          className="success-button"
          onClick={() => {
            handleAccept(invite.id).then();
          }}
        >
          Accept
        </button>
        <button
          className="error-button"
          onClick={() => {
            handleRemove(invite.id).then();
          }}
        >
          Decline
        </button>
      </div>
    </article>
  );
};

export default ChatRoomInviteBlock;

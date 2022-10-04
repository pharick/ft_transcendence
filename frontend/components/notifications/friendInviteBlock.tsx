import { FC, useContext } from 'react';
import { InviteFriends } from '../../types/interfaces';

import styles from '../../styles/Notifications.module.css';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { fetchWithHandleErrors } from '../../utils';

interface FriendInviteBlockProps {
  invite: InviteFriends;
}

const FriendInviteBlock: FC<FriendInviteBlockProps> = ({ invite }) => {
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);

  const handleAccept = async (inviteId: number) => {
    await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: `/api/friends/invites/${inviteId}/accept`,
      method: 'POST',
    });
  };

  const handleRemove = async (inviteId: number) => {
    await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: `/api/friends/invites/${inviteId}`,
      method: 'DELETE',
    });
  };

  return (
    <article className={styles.block}>
      <p>
        <b>{invite.inviter.username}</b> invites you to friends
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

export default FriendInviteBlock;

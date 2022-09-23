import { FC } from 'react';
import { ChatRoomInvite } from '../../types/interfaces';
import Link from 'next/link';

import styles from '../../styles/Notifications.module.css';

interface ChatRoomInviteBlockProps {
  invite: ChatRoomInvite;
}

const ChatRoomInviteBlock: FC<ChatRoomInviteBlockProps> = ({ invite }) => {
  return (
    <article className={styles.block}>
      <p>
        <b>{invite.inviter.username}</b> invites you to{' '}
        <b>"{invite.room.name}"</b> chat room
      </p>
    </article>
  );
};

export default ChatRoomInviteBlock;

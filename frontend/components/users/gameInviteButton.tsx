import React, { FC, useState } from 'react';
import { User } from '../../types/interfaces';
import Image from 'next/image';
import pingpong from '../../images/pingpong.svg';
import GameInviteModal from '../games/gameInviteModal';

interface InviteProps {
  user: User;
}

const GameInviteButton: FC<InviteProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const className = isSuccess ? 'success-button' : '';
  const text = isSuccess ? 'Invited' : 'Invite to game';

  return (
    <>
      <button
        disabled={isSuccess}
        className={`${className} icon-button`}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <Image src={pingpong} alt={text} width={25} height={25} />
        {text}
      </button>

      <GameInviteModal
        isOpen={isOpen}
        cancelButtonHandler={() => {
          setIsOpen(false);
        }}
        user={user}
        setIsSuccess={setIsSuccess}
      />
    </>
  );
};

export default GameInviteButton;

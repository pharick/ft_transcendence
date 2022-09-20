import React, { FC, SyntheticEvent, useContext, useState } from 'react';
import { User } from '../../types/interfaces';
import { CreatePendingGameDto } from '../../types/dtos';
import { fetchWithHandleErrors } from '../../utils';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import Image from 'next/image';
import pingpong from '../../images/pingpong.svg';
import dynamic from 'next/dynamic';

const Modal = dynamic(() => import('../../components/layout/modal'), {
  ssr: false,
});

interface InviteProps {
  user: User;
}

const GameInviteButton: FC<InviteProps> = ({ user }) => {
  const [mode, setMode] = useState('0');
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);

  const handleGameInvite = async (e: SyntheticEvent) => {
    e.preventDefault();
    const createPendingGameDto: CreatePendingGameDto = {
      player2Id: user.id,
      mode: parseInt(mode, 10),
    };

    const response = await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: '/api/pending/',
      method: 'PUT',
      body: createPendingGameDto,
      authRequired: true,
    });

    if (response?.status == 409) setIsError(true);
    if (response?.status == 200) setIsSuccess(true);

    setIsOpen(false);
  };

  const className = isSuccess
    ? 'success-button'
    : isError
    ? 'error-button'
    : '';
  const text = isSuccess
    ? 'Invited'
    : isError
    ? 'Already invited'
    : 'Invite to game';

  const makeModalWindow = () => {
    setIsOpen(true);
  };

  return (
    <>
      <button
        disabled={isSuccess || isError}
        className={`${className} icon-button`}
        onClick={makeModalWindow}
      >
        <Image src={pingpong} alt={text} width={25} height={25} />
        {text}
      </button>

      <Modal
        isOpen={isOpen}
        cancelButtonText="Cancel"
        cancelButtonHandler={() => {
          setIsOpen(false);
        }}
        isCancelButtonDisabled={Boolean(false)}
        title={'Choose parameters of the game'}
      >
        <form className="d-flex" onSubmit={handleGameInvite}>
          <select
            className="flex-grow-1"
            value={mode}
            onChange={(e) => {
              setMode(e.target.value);
            }}
          >
            <option disabled>Choose a mode</option>
            <option value="0">Classic game</option>
            <option value="1">Arcade game with one barrier</option>
            <option selected value="2">
              Arcade game with two barriers
            </option>
          </select>
          <button type="submit">Invite</button>
        </form>
      </Modal>
    </>
  );
};

export default GameInviteButton;

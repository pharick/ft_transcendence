import React, { FC, useContext, useState } from 'react';
import { User } from '../../types/interfaces';
import { CreatePendingGameDto } from '../../types/dtos';
import { fetchWithHandleErrors } from '../../utils';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import Image from 'next/image';
import pingpong from '../../images/pingpong.svg';
import ReadyGameBlock from '../notifications/readyGameBlock';
import Modal from '../layout/modal';

interface InviteProps {
  user: User;
}

const GameInviteArcadeButton: FC<InviteProps> = ({ user }) => {
  const [mode, setMode] = useState('1');
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);

  const handleGameInvite = async () => {
    setIsOpen(false);
    console.log(mode);
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
    : 'Invite to arcade game';

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
        cancelButtonText={'OK'}
        cancelButtonHandler={handleGameInvite}
        isCancelButtonDisabled={Boolean(false)}
        title={'Choose parameters of the game'}
      >
        {
          <div>
            <form action="select1.php" method="post">
              <p>
                <select
                  size={1}
                  value={mode}
                  onChange={(e) => {
                    setMode(e.target.value);
                  }}
                >
                  <option disabled>Choose a mode</option>
                  <option value="1">One barrier</option>
                  <option selected value="2">
                    Two barriers
                  </option>
                </select>
              </p>
            </form>
          </div>
        }
      </Modal>
    </>
  );
};

export default GameInviteArcadeButton;

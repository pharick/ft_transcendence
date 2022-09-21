import React, { FC, SyntheticEvent, useContext, useState } from 'react';
import dynamic from 'next/dynamic';
import { CreatePendingGameDto } from '../../types/dtos';
import { fetchWithHandleErrors } from '../../utils';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { User } from '../../types/interfaces';
import styles from '../../styles/GameInviteModal.module.css';

const Modal = dynamic(() => import('../../components/layout/modal'), {
  ssr: false,
});

interface GameInviteModalProps {
  isOpen: boolean;
  cancelButtonHandler: () => void;
  user: User;
  setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const GameInviteModal: FC<GameInviteModalProps> = ({
  isOpen,
  cancelButtonHandler,
  user,
  setIsSuccess,
}) => {
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);
  const [mode, setMode] = useState('0');
  const [isError, setIsError] = useState(false);

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
      ignoreCodes: [409],
    });

    if (response?.status == 409) {
      setIsError(true);
    } else if (response?.status == 200) {
      setIsSuccess(true);
      cancelButtonHandler();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      cancelButtonText="Cancel"
      cancelButtonHandler={cancelButtonHandler}
      title={'Choose parameters of the game'}
    >
      {isError && (
        <p className={styles.error}>You already invited this player</p>
      )}
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
          <option value="2">Arcade game with two barriers</option>
        </select>
        <button type="submit">Invite</button>
      </form>
    </Modal>
  );
};

export default GameInviteModal;

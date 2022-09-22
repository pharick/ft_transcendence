import React, { FC, ReactNode } from 'react';
import useKeyboardEventListener from '../../hooks/use_event_listener';

import styles from '../../styles/Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  children?: ReactNode;
  title: string;
  isCancelButtonDisabled?: boolean;
  cancelButtonText?: string;
  cancelButtonHandler: () => void;
}

const Modal: FC<ModalProps> = ({
  children,
  isOpen,
  title,
  cancelButtonText,
  cancelButtonHandler,
  isCancelButtonDisabled,
}) => {
  if (isCancelButtonDisabled == undefined) isCancelButtonDisabled = false;

  const keyDownHandler = (e: KeyboardEvent) => {
    if (isOpen && e.code == 'Escape') {
      cancelButtonHandler();
    }
  };

  useKeyboardEventListener(
    'keydown',
    keyDownHandler as EventListener,
    document,
  );

  if (isOpen) {
    return (
      <div className={styles.dimmer}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h4 className={styles.title}>{title}</h4>
          </div>
          <div className={styles.body}>{children}</div>
          <div className={styles.footer}>
            <button
              onClick={cancelButtonHandler}
              className="error-button"
              disabled={isCancelButtonDisabled}
            >
              {cancelButtonText || 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default Modal;

import React, { FC, ReactNode } from 'react';
import useKeyboardEventListener from '../../hooks/use_event_listener';

interface ModalProps {
  isOpen: boolean;
  children?: ReactNode;
  title: string;
  isCancelButtonDisabled?: boolean;
  cancelButtonText: string;
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
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">{title}</h4>
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <button
              onClick={cancelButtonHandler}
              className="error-button"
              disabled={isCancelButtonDisabled}
            >
              {cancelButtonText}
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

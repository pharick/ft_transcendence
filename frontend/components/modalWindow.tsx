import React, {useEffect} from 'react'

const Modal = (props: { show: boolean, onClose: any; }) => {
  const closeOnEscapeKeyDown = (e: any) => {
    if ((e.charCode || e.keyCode) === 27) {
      props.onClose();
    }
  };
  useEffect(() => {
    document.body.addEventListener("keydown", closeOnEscapeKeyDown);
    return function cleanup() {
      document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
    };
  }, []);
  if (!props.show) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Trying to find an opponent</h4>
        </div>
        <div className="modal-body">
          spinner
        </div>
        <div className="modal-footer">
          <button onClick={props.onClose} className="error-button">Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default Modal
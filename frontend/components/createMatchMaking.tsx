import {FC, useRef, useState} from 'react';
import {Socket} from "engine.io-client";
import ModalWindow from "./modalWindow";
import Modal from "./modalWindow";

const MatchMakingModeButton: FC = () => {

  const [show, setShow] = useState(false)
  const socket = useRef<Socket>()

  const createMatchMaking = async () => {
    const response = await fetch('/api/matchMaking', {
      method: 'PUT',
    });
    const data = await response.json();
    console.log(data);
  }

  const cancelMatchMaking = async () => {
    setShow(false);
    const response = await fetch('/api/matchMaking', {
      method: 'DELETE',
    });
  }

  async function cancelMatching(): Promise<boolean> {
    setShow(false);
    await cancelMatchMaking();
    return false;
  }

  return (
    <section>
      <div>
        <button
          onClick={() => {
            setShow(true);
            createMatchMaking().then();
          }}
        >
          MatchMakingMode
        </button>
        <Modal onClose={() => cancelMatching() } show={show} />
      </div>
    </section>
  )
  //<button onClick={createGame}>Play with someone</button>;
};

export default MatchMakingModeButton;

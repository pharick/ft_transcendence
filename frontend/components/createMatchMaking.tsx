import {FC, useRef} from 'react';
import {Socket} from "engine.io-client";
import ModalWindow from "./modalWindow";

const MatchMakingModeButton: FC = () => {
  const socket = useRef<Socket>()
  const createMatchMaking = async () => {
    const response = await fetch('/api/matchMaking', {
      method: 'PUT',
    });
    const data = await response.json();
    console.log(data);
  }

  const cancelMatchMaking = async () => {
    const response = await fetch('/api/matchMaking', {
      method: 'DELETE',
  });
  }

  return (
    <section>
      <div>
                <button
                  onClick={() => {
                    createMatchMaking().then();
                    //<ModalWindow />
                    // TODO modal window
                  }}
                >
                  MatchMakingMode
                </button>
              </div>
    </section>
  )
  //<button onClick={createGame}>Play with someone</button>;
};

export default MatchMakingModeButton;

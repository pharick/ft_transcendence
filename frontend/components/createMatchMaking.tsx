import {FC, useCallback, useEffect, useRef, useState} from 'react';
import Modal from "./modalWindow";
import {io, Socket} from "socket.io-client";

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

  function matchMakingUpdate(id1: number, id2: number, gameId: string) {
    console.log(`matchMaking ${id1}, ${id2}, ${gameId}`);
    // TODO socket получить данные (прочитать данные из сокета и понять это нас касается или нет)
  }

  useEffect(() => {

    if (socket.current && socket.current?.active) return;
    socket.current = io(
      `${
        process.env.NODE_ENV == 'development'
          ? process.env.NEXT_PUBLIC_INTERNAL_API_URL
          : ''
      }/matchmaking`,
    );
    socket.current?.connect();

    //socket.current?.on('updateMatchMaking', (...args) => {
      //matchMakingUpdate(args[0], args[1], args[2]);
   // });

  }, [matchMakingUpdate]);

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

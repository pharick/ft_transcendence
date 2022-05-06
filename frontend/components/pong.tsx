import {FC, useEffect, useRef, useState} from 'react';
import {io, Socket} from "socket.io-client";

import useEventListener from '../hooks/use_event_listener';
import {FrameInfo, GameInfo, User} from '../types/interfaces';


interface PongProps {
    gameInfo: GameInfo;
    user: User | undefined;
    userSessionId: string | undefined;
}

const Pong: FC<PongProps> = ({gameInfo, user, userSessionId}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const socket = useRef<Socket>();

    const renderField = ({ballX, ballY, club1Pos, club2Pos}: FrameInfo) => {
        const canvas = canvasRef.current;
        const ctx = canvasRef.current?.getContext('2d');

        // счет от сервера
        const left = 1230;
        const right = 4567;

        if (!canvas || !ctx) {
            console.log("Update your browser, canvas is not supported in the current version")
            return;
        }

        const ballSize = canvas.width / 24 //10;
        const paddleHeight = ballSize * 5;
        const paddleTab = ballSize;
        // const maxPaddleY = canvas.height - ballSize - paddleHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //ball
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //score
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'
        document.getElementsByTagName('head')[0].appendChild(link);
        ctx.font = '50px "Press Start 2P"'
        ctx.textBaseline = 'top';
        ctx.fillStyle = "darkgrey";
        ctx.textAlign = "center";
        ctx.fillText(left + '   ' + right, canvas.width / 2, (3 * ballSize));

        //centerline
        ctx.fillStyle = 'lightgrey';
        for (let i = ballSize; i < canvas.height - ballSize; i += ballSize * 2) {
            ctx.fillRect(canvas.width / 2 - ballSize / 2, i, ballSize / 4, ballSize / 2);
        }

        //left
        ctx.fillStyle = 'white';
        ctx.fillRect(ballX, ballY, ballSize, ballSize);


        // if (club1Pos < ballSize) {
        //     ctx.fillRect(paddleTab, ballSize, ballSize, paddleHeight); // 160
        // } else if (club1Pos > maxPaddleY) {
        //     ctx.fillRect(paddleTab, maxPaddleY, ballSize, paddleHeight);
        // } else {
        //     ctx.fillRect(paddleTab, club1Pos, ballSize, paddleHeight); // 160
        // }
        // ;

        ctx.fillRect(paddleTab, club1Pos, ballSize, paddleHeight);

        ctx.fillRect(canvas.width - paddleTab - ballSize, club2Pos, ballSize, paddleHeight); // 160
    };

    const toggleGameRunning = async () => {
        const response = await fetch(`/api/games/${gameInfo.gameId}/toggle`, {method: 'POST'});
    };

    useEffect(() => {
        if (socket.current)
            return;

        socket.current = io('http://localhost:4000');
        socket.current?.emit('connectToGame', gameInfo.gameId);

        socket.current?.on('nextFrame', (frame: FrameInfo) => {
            renderField(frame);
        });
    }, []);

    const keyHandler = (e: KeyboardEvent) => {
        let delta = 0;
        if (e.code == 'ArrowUp') delta = -20;
        else if (e.code == 'ArrowDown') delta = 20;

        if (delta != 0 &&
            (gameInfo.player1?.id == user?.id ||
                gameInfo.player2?.id == user?.id)) {
            socket.current?.emit('moveClub', {userSessionId, delta});
        }
    };

    useEventListener('keydown', keyHandler, document);

    return (
        <>
            <head>
                <meta charSet={"UTF-8"}/>
                <title>Ping-pong</title>
            </head>
            <body>
            <canvas width={800} height={600} ref={canvasRef}></canvas>
            <button onClick={toggleGameRunning}>Run / Pause</button>
            </body>
        </>
    );
};

export default Pong;

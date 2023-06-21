import React from 'react'
import Square from './Square'
import { useState } from 'react';
import { useEffect } from 'react';
import Modal from './Modal';
import { useRef } from 'react';


const defaultRows = Array(9).fill(null)
const players = ['ГРАВЕЦЬ 1', 'ГРАВЕЦЬ 2']
const defaultPlayersTimer = {
    X: 0,
    O: 0,
}

const Board = () => {
    const [xIsNext, setXIsNext] = useState(true)
    const [squares, setSquares] = useState(defaultRows);
    const [totalGames, setTotalGames] = useState(0)
    const [message, setMessage] = useState('')
    const [countWin, setCountWin] = useState({
        X: 0,
        O: 0
    })
    const [statusGame, setStatusGame] = useState('')

    const [playerTimers, setPlayerTimers] = useState(defaultPlayersTimer);
    const [showModal, setShowModal] = useState(false);
    const timerRef = useRef(null);

    const startTimer = () => {
        stopTimer();
        timerRef.current = setInterval(() => {
            setPlayerTimers((prevState) => ({
                ...prevState,
                [xIsNext ? 'X' : 'O']: prevState[xIsNext ? 'X' : 'O'] + 1,
            }));
        }, 1000);
    };

    const stopTimer = () => {
        clearInterval(timerRef.current);
    };

    const handleClick = (idx) => {
        if (squares[idx] || calculateWinners(squares)) {
            return;
        }
        const nextSquares = squares.slice()
        nextSquares[idx] = xIsNext ? 'X' : 'O'
        setSquares(nextSquares)
        setXIsNext(!xIsNext)
    }

    const calculateWinners = (squares) => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a]
            }
        }
        let isDraw = squares.every(square => square !== null);
        if (isDraw) {
            return 'draw'
        }
        return null
    }

    const WIN_OR_DRAW = calculateWinners(squares)

    useEffect(() => {
        // If no 'X' or 'Y' and no 'draw'
        if (!WIN_OR_DRAW) {
            startTimer()
            setMessage(xIsNext ? players[0] : players[1])
            return;
        }
        if (WIN_OR_DRAW === 'draw') {
            stopTimer()
            setTotalGames((prevState) => prevState + 1)
            setStatusGame(WIN_OR_DRAW)
            setMessage('Нічия! Спробуйте ще :)')
            showModalWithDelay()
            return;
        }
        if (WIN_OR_DRAW) {
            stopTimer()
            setCountWin((prevState) => ({
                ...prevState,
                [WIN_OR_DRAW]: prevState[WIN_OR_DRAW] + 1
            }));
            setStatusGame(WIN_OR_DRAW)
            setTotalGames((prevState) => prevState + 1)
            setMessage(`${WIN_OR_DRAW === 'X' ? `${players[0]}` : `${players[1]}`} переміг. Вітаємо! `)
            showModalWithDelay()
        }
    }, [WIN_OR_DRAW, xIsNext]);


    const handleResetGame = () => {
        setXIsNext(true)
        setSquares(defaultRows)
        setShowModal(false)
        setPlayerTimers(defaultPlayersTimer)
        setStatusGame('')
    }

    const showModalWithDelay = () => {
        setTimeout(() => {
            setShowModal(true)
        }, 2000)
    }

    const formatTime = (statusGame) => {
        let copyTime;
        if (statusGame === 'draw') {
            copyTime = playerTimers.X + playerTimers.O
        } else if (statusGame === 'X' || statusGame === 'O') {
            copyTime = playerTimers[statusGame]
        } else {
            copyTime = xIsNext ? playerTimers.X : playerTimers.O
        }


        const minutes = Math.floor(copyTime / 60);
        const seconds = copyTime % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`;
    };



    return (
        <>
            <div>Усього iгр: {totalGames}</div>
            <div>{formatTime(statusGame)}</div>
            <button onClick={handleResetGame}>Нова Гра</button>
            <div>{message}</div>
            {showModal && <Modal onHideModal={() => setShowModal(false)} text={`${message} - Загальний Час ${formatTime(statusGame)}`} />}
            <div className='player'>{`${players[0]}: ● символ - Х ● кількість виграшів - ${countWin.X} `}</div>
            <div className='player'>{`${players[1]}: ● символ - O ● кількість виграшів - ${countWin.O} `}</div>
            <div className="board-row">
                <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
                <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
                <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
            </div>
            <div className="board-row">
                <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
                <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
                <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
                <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
                <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
            </div>
        </>
    )
}

export default Board
import React, { useState, useEffect } from 'react';
import './game.scss';

const Game: React.FC = () => {
    const [coins, setCoins] = useState<number>(0);
    const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
    const [nextId, setNextId] = useState<number>(0);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number>(10);

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!gameStarted) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setCoins(coins + 1);
        setClicks([...clicks, { id: nextId, x, y }]);
        setNextId(nextId + 1);

        setTimeout(() => {
            setClicks(currentClicks => currentClicks.filter(click => click.id !== nextId));
        }, 1000);
    };

    const handleStartClick = () => {
        setGameStarted(true);
        setTimeLeft(10);
    };

    useEffect(() => {
        if (gameStarted && timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setGameStarted(false);
        }
    }, [gameStarted, timeLeft]);

    return (
        <div className="game">
            {!gameStarted && <button className="start-button default-button" onClick={handleStartClick}>Start</button>}
            {gameStarted && (
                <>
                    <div className='coins'>{coins}</div>
                    <button className='button-game' onClick={handleButtonClick}>
                        <svg width="230" height="230" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="115" cy="115" r="110" stroke="white" strokeWidth="1" fill="none" />
                        </svg>
                        {clicks.map(click => (
                            <div
                                key={click.id}
                                className="floating-number"
                                style={{ left: click.x, top: click.y }}
                            >
                                1
                            </div>
                        ))}
                    </button>
                    <div className='progress-bar-container'>
                        <div
                            className='progress-bar'
                            style={{ width: `${(timeLeft / 10) * 100}%` }}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Game;
import React, { useState, useEffect } from 'react';
import './game.scss';

interface GameProps {
    duration: number; // Длительность игры в секундах
}

const Game: React.FC<GameProps> = ({ duration }) => {
    const [coins, setCoins] = useState<number>(0);
    const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);
    const [nextId, setNextId] = useState<number>(0);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number>(duration);
    const [showClaimButton, setShowClaimButton] = useState<boolean>(false);

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!gameStarted) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setCoins(coins + 1);
        setClicks([...clicks, { id: nextId, x, y }]);
        setNextId(nextId + 1);

        setTimeout(() => {
            setClicks((currentClicks) => currentClicks.filter((click) => click.id !== nextId));
        }, 1000);
    };

    const handleStartClick = () => {
        setGameStarted(true);
        setTimeLeft(duration); // Установите начальное время из пропса
    };

    const handleClaimClick = () => {
        setGameStarted(false);
        setShowClaimButton(false);
        setCoins(0);
        setClicks([]);
    };

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (gameStarted) {
            timer = setTimeout(() => {
                setTimeLeft((prevTimeLeft) => {
                    const newTimeLeft = prevTimeLeft - 1;
                    if (newTimeLeft === 0) {
                        setShowClaimButton(true);
                        setGameStarted(false);
                    }
                    return newTimeLeft;
                });
            }, 1000);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [gameStarted, timeLeft]);

    return (
        <div className="game">
            {!gameStarted && !showClaimButton && (
                <button className="start-button default-button" onClick={handleStartClick}>
                    Start
                </button>
            )}
            {gameStarted && (
                <>
                    <div className="coins-container">
                        <div className="coins">{coins}</div>
                    </div>
                    <button className="button-game" onClick={handleButtonClick}>
                        <svg width="230" height="230" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="115" cy="115" r="110" stroke="#ddd1ff" stroke-width="1" fill="none" />
                            <path d="M 5,115 A 110,110 0 0,1 225,115" stroke="black" stroke-width="10" fill="none">
                                <animateTransform
                                    attributeName="transform"
                                    type="rotate"
                                    from="0 115 115"
                                    to="360 115 115"
                                    dur="1s"
                                    repeatCount="indefinite"
                                />
                            </path>
                        </svg>
                        {clicks.map((click) => (
                            <div
                                key={click.id}
                                className="floating-number"
                                style={{ left: click.x, top: click.y }}
                            >
                                1
                            </div>
                        ))}
                    </button>
                    <div className="progress-bar-wrapper">
                        <div className="progress-bar-container">
                            <div className="progress-bar" style={{ width: `${(timeLeft / duration) * 100}%` }} />
                        </div>
                        <div className="time-left">{timeLeft}s</div>
                    </div>
                </>
            )}
            {!gameStarted && showClaimButton && (
                <button className="claim-button default-button" onClick={handleClaimClick}>
                    Claim
                </button>
            )}
        </div>
    );
};

export default Game;
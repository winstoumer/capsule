import React, { useState, useEffect } from 'react';
import './game.scss';

interface GameProps {
    duration: number; // Длительность игры в секундах
    coinsPerClick: number; // Количество монет за клик
    maxTouches: number; // Максимальное количество точек касания
}

const Game: React.FC<GameProps> = ({ duration, coinsPerClick, maxTouches }) => {
    const [coins, setCoins] = useState<number>(0);
    const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);
    const [nextId, setNextId] = useState<number>(0);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number>(duration);
    const [showClaimButton, setShowClaimButton] = useState<boolean>(false);

    const handleTouch = (e: React.TouchEvent<HTMLButtonElement>) => {
        if (!gameStarted) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const touchCount = Math.min(e.touches.length, maxTouches);
        const newClicks: { id: number; x: number; y: number }[] = [];
        let totalCoins = 0;

        for (let i = 0; i < touchCount; i++) {
            const touch = e.touches[i];
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            newClicks.push({ id: nextId + i, x, y });
            totalCoins += coinsPerClick;
        }

        setCoins(coins + totalCoins);
        setClicks([...clicks, ...newClicks]);
        setNextId(nextId + touchCount);

        setTimeout(() => {
            setClicks((currentClicks) => currentClicks.filter((click) => !newClicks.some(newClick => newClick.id === click.id)));
        }, 1000);
    };

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!gameStarted) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newClick = { id: nextId, x, y };

        setCoins(coins + coinsPerClick);
        setClicks([...clicks, newClick]);
        setNextId(nextId + 1);

        setTimeout(() => {
            setClicks((currentClicks) => currentClicks.filter((click) => click.id !== newClick.id));
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
                    <button className="button-game" onMouseDown={handleButtonClick} onTouchStart={handleTouch}>
                        <svg width="230" height="230" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="115" cy="115" r="110" stroke="#ddd1ff" strokeWidth="1" fill="none" />
                            <path d="M 5,115 A 110,110 0 0,1 225,115" stroke="black" strokeWidth="10" fill="none">
                                <animateTransform
                                    attributeName="transform"
                                    type="rotate"
                                    from="0 115 115"
                                    to="360 115 115"
                                    dur="0.4s"
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
                                +{coinsPerClick}
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

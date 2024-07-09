import React, { useState, useEffect, useRef } from 'react';
import './game.scss';
import { Link } from 'react-router-dom';

interface GameProps {
    duration: number; // Длительность игры в секундах
    coinsPerClick: number; // Количество монет за клик
    maxTouches: number; // Максимальное количество точек касания
    multiplier: boolean; // Флаг для отображения и использования мультипликатора x2
}

const Game: React.FC<GameProps> = ({ duration, coinsPerClick, maxTouches, multiplier }) => {
    const [coins, setCoins] = useState<number>(0);
    const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);
    const [nextId, setNextId] = useState<number>(0);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number>(duration);
    const [showClaimButton, setShowClaimButton] = useState<boolean>(false);
    const [circleScale, setCircleScale] = useState<boolean>(false);
    const [coinContainerClicked, setCoinContainerClicked] = useState<boolean>(false);
    const [progressBarColor, setProgressBarColor] = useState<string>('');

    const activeTouches = useRef<Set<number>>(new Set());
    const buttonRef = useRef<HTMLButtonElement>(null);

    const isWithinCircle = (x: number, y: number) => {
        const centerX = 140; // Адаптировано под размеры кнопки
        const centerY = 140; // Адаптировано под размеры кнопки
        const radius = 140; // Адаптировано под размеры кнопки
        return (x - centerX) ** 2 + (y - centerY) ** 2 <= radius ** 2;
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
        if (!gameStarted || !buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const newClicks: { id: number; x: number; y: number }[] = [];
        let totalCoins = 0;
        let touchCount = 0;

        Array.from(e.changedTouches).forEach(touch => {
            if (activeTouches.current.size < maxTouches && !activeTouches.current.has(touch.identifier)) {
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                if (isWithinCircle(x, y)) {
                    activeTouches.current.add(touch.identifier);
                    newClicks.push({ id: nextId + newClicks.length, x, y });
                    totalCoins += coinsPerClick * (multiplier ? 2 : 1);
                    touchCount++;
                }
            }
        });

        if (newClicks.length > 0) {
            setCircleScale(true);
        }

        setCoins(prevCoins => prevCoins + totalCoins);
        setClicks(prevClicks => [...prevClicks, ...newClicks]);
        setNextId(prevId => prevId + touchCount);

        setTimeout(() => {
            setClicks((currentClicks) => currentClicks.filter((click) => !newClicks.some(newClick => newClick.id === click.id)));
            setCircleScale(false); // Сбрасываем масштабирование после анимации
        }, 1000);

        // Увеличение контейнера с монетами и мультипликатором на 10%
        setCoinContainerClicked(true);
        setTimeout(() => {
            setCoinContainerClicked(false);
        }, 400);

        // Установка переменных для координат клика
        newClicks.forEach(click => {
            document.documentElement.style.setProperty('--click-x', `${click.x}px`);
            document.documentElement.style.setProperty('--click-y', `${click.y}px`);
        });

        e.preventDefault(); // Отменяем действие по умолчанию, чтобы предотвратить нежелательное поведение браузера
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLButtonElement>) => {
        Array.from(e.changedTouches).forEach(touch => {
            if (activeTouches.current.has(touch.identifier)) {
                activeTouches.current.delete(touch.identifier);
            }
        });

        e.preventDefault(); // Отменяем действие по умолчанию, чтобы предотвратить нежелательное поведение браузера
    };

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!gameStarted || !buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (isWithinCircle(x, y)) {
            const newClick = { id: nextId, x, y };

            setCoins(prevCoins => prevCoins + coinsPerClick * (multiplier ? 2 : 1)); // Умножаем на 2, если multiplier === true
            setClicks(prevClicks => [...prevClicks, newClick]);
            setNextId(prevId => prevId + 1);

            setCircleScale(true);

            setTimeout(() => {
                setClicks((currentClicks) => currentClicks.filter((click) => click.id !== newClick.id));
            }, 1000);

            // Увеличение контейнера с монетами и мультипликатором на 10%
            setCoinContainerClicked(true);
            setTimeout(() => {
                setCoinContainerClicked(false);
            }, 400);

            // Установка переменных для координат клика
            document.documentElement.style.setProperty('--click-x', `${x}px`);
            document.documentElement.style.setProperty('--click-y', `${y}px`);
        }
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
                    // Установка класса прогресс-бара в зависимости от оставшегося времени
                    if (newTimeLeft <= duration * 0.15) {
                        setProgressBarColor('red');
                    } else if (newTimeLeft <= duration * 0.35) {
                        setProgressBarColor('orange');
                    } else {
                        setProgressBarColor('');
                    }
                    return newTimeLeft;
                });
            }, 1000);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [gameStarted, timeLeft, duration]);

    return (
        <div className="game">
            {!gameStarted && !showClaimButton && (
                <button className="start-button default-button" onClick={handleStartClick}>
                    Start
                </button>
            )}
            {gameStarted && (
                <>
                    <div className={`coins-container ${coinContainerClicked ? 'scaled' : ''}`}>
                        <div className="coins">{coins.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        {multiplier && <div className="multiplier">x2</div>}
                    </div>
                    <div className="clicks-wrapper">
                        <div className="button-game-container">
                            <button
                                ref={buttonRef}
                                className={`button-game ${circleScale ? 'scaled' : ''}`}
                                onMouseDown={handleButtonClick}
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                                style={{ width: '280px', height: '280px' }} // Установка размеров кнопки
                            >
                                {/* Ваш SVG код здесь */}
                                <svg width="280" height="280" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 280">
                                    <defs>
                                        {/* Градиент для сияющего эффекта */}
                                        <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                            <stop offset="0%" style={{ stopColor: '#F8E900', stopOpacity: 1 }} />
                                            <stop offset="70%" style={{ stopColor: 'black', stopOpacity: 0.5 }} />
                                            <stop offset="100%" style={{ stopColor: 'black', stopOpacity: 0 }} />
                                        </radialGradient>
                                    </defs>
                                    <circle cx="140" cy="140" r="140" fill="url(#glowGradient)" />
                                </svg>
                                {/* Конец SVG кода */}
                                {clicks.map((click) => (
                                    <div
                                        key={click.id}
                                        className="floating-number"
                                        style={{
                                            left: `${click.x}px`,
                                            top: `${click.y}px`,
                                        }}
                                    >
                                        +{coinsPerClick * (multiplier ? 2 : 1)}
                                    </div>
                                ))}
                            </button>
                        </div>
                        <div className={`progress-bar ${progressBarColor}`} style={{ width: `${(timeLeft / duration) * 100}%` }} />
                    </div>
                </>
            )}
            {showClaimButton && (
                <div className="claim-container">
                    <p>You earned {coins.toLocaleString()} coins!</p>
                    <button className="claim-button default-button" onClick={handleClaimClick}>
                        Claim
                    </button>
                    <Link to="/" className="back-link">
                        Back to Home
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Game;

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
    const [animationSpeed, setAnimationSpeed] = useState<string>('1s');
    const [coinContainerClicked, setCoinContainerClicked] = useState<boolean>(false);
    const [progressBarColor, setProgressBarColor] = useState<string>('');

    const activeTouches = useRef<Set<number>>(new Set());
    const buttonRef = useRef<HTMLButtonElement>(null);

    const isWithinCircle = (x: number, y: number) => {
        const centerX = 115;
        const centerY = 115;
        const radius = 115;
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
            setAnimationSpeed('0.2s');
        }

        setCoins(prevCoins => prevCoins + totalCoins);
        setClicks(prevClicks => [...prevClicks, ...newClicks]);
        setNextId(prevId => prevId + touchCount);

        setTimeout(() => {
            setClicks((currentClicks) => currentClicks.filter((click) => !newClicks.some(newClick => newClick.id === click.id)));
            setCircleScale(false); // Сбрасываем масштабирование после анимации
            setAnimationSpeed('1s'); // Сбрасываем скорость анимации после завершения
        }, 1000);

        // Увеличение контейнера с монетами и мультипликатором на 10%
        setCoinContainerClicked(true);
        setTimeout(() => {
            setCoinContainerClicked(false);
        }, 400);

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
            setAnimationSpeed('0.2s');

            setTimeout(() => {
                setClicks((currentClicks) => currentClicks.filter((click) => click.id !== newClick.id));
            }, 1000);

            // Увеличение контейнера с монетами и мультипликатором на 10%
            setCoinContainerClicked(true);
            setTimeout(() => {
                setCoinContainerClicked(false);
            }, 400);
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
                            >
                                <svg width="230" height="230" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="115" cy="115" r="115" fill="black" />
                                    {/* Первый круг, вращающийся по часовой стрелке */}
                                    <path
                                        d="M 5,115 A 110,110 0 0,1 225,115"
                                        stroke="#2d2d2d"
                                        strokeWidth="2"
                                        fill="none"
                                        style={{ animationDuration: animationSpeed }}
                                    >
                                        <animateTransform
                                            attributeName="transform"
                                            type="rotate"
                                            from="0 115 115"
                                            to="360 115 115"
                                            dur={animationSpeed}
                                            repeatCount="indefinite"
                                        />
                                        <animate
                                            attributeName="stroke-width"
                                            values="2;5;2"
                                            dur="1s"
                                            repeatCount="indefinite"
                                        />
                                    </path>
                                    {/* Второй круг, вращающийся против часовой стрелки */}
                                    <path
                                        d="M 5,115 A 110,110 0 0,0 225,115"
                                        stroke="#1a1a1a"
                                        strokeWidth="5"
                                        fill="none"
                                        style={{ animationDirection: 'reverse', animationDuration: animationSpeed }}
                                    >
                                        <animateTransform
                                            attributeName="transform"
                                            type="rotate"
                                            from="0 115 115"
                                            to="-360 115 115"
                                            dur={animationSpeed}
                                            repeatCount="indefinite"
                                        />
                                        <animate
                                            attributeName="stroke-width"
                                            values="5;2;5"
                                            dur="1s"
                                            repeatCount="indefinite"
                                        />
                                    </path>
                                    {/* Третий круг, начиная с точки (115, 5) */}
                                    <path
                                        d="M 115,5 A 110,110 0 0,1 115,225"
                                        stroke="#0d0d0d"
                                        strokeWidth="4"
                                        fill="none"
                                        style={{ animationDuration: animationSpeed }}
                                    >
                                        <animateTransform
                                            attributeName="transform"
                                            type="rotate"
                                            from="0 115 115"
                                            to="360 115 115"
                                            dur={animationSpeed}
                                            repeatCount="indefinite"
                                        />
                                        <animate
                                            attributeName="stroke-width"
                                            values="4;7;4"
                                            dur="1s"
                                            repeatCount="indefinite"
                                        />
                                        <animate
                                            attributeName="opacity"
                                            values="1;0.5;1"
                                            dur="1s"
                                            repeatCount="indefinite"
                                        />
                                    </path>
                                    {/* Четвертый круг, начиная с точки (225, 115) */}
                                    <path
                                        d="M 225,115 A 110,110 0 0,1 5,115"
                                        stroke="#000000"
                                        strokeWidth="1"
                                        fill="none"
                                        style={{ animationDuration: animationSpeed }}
                                    >
                                        <animateTransform
                                            attributeName="transform"
                                            type="rotate"
                                            from="0 115 115"
                                            to="360 115 115"
                                            dur={animationSpeed}
                                            repeatCount="indefinite"
                                        />
                                        <animate
                                            attributeName="stroke-width"
                                            values="1;4;1"
                                            dur="1s"
                                            repeatCount="indefinite"
                                        />
                                        <animate
                                            attributeName="opacity"
                                            values="1;0.3;1"
                                            dur="1s"
                                            repeatCount="indefinite"
                                        />
                                    </path>
                                    {/* Пятый круг, начиная с точки (115, 225) */}
                                    <path
                                        d="M 115,225 A 110,110 0 0,1 115,5"
                                        stroke="#1a1a1a"
                                        strokeWidth="3"
                                        fill="none"
                                        style={{ animationDuration: animationSpeed }}
                                    >
                                        <animateTransform
                                            attributeName="transform"
                                            type="rotate"
                                            from="0 115 115"
                                            to="360 115 115"
                                            dur={animationSpeed}
                                            repeatCount="indefinite"
                                        />
                                        <animate
                                            attributeName="stroke-width"
                                            values="3;6;3"
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
                                        {coinsPerClick * (multiplier ? 2 : 1)}
                                    </div>
                                ))}
                            </button>
                        </div>
                    </div>
                    <div className='panel-wrapper'>
                        <div className='nav-wrapper'>
                            <Link to="/boostgame" className='n-ic'>🚀</Link>
                        </div>
                        <div className="progress-bar-wrapper">
                            <div className={`progress-bar-container ${progressBarColor}`}>
                                <div className="progress-bar" style={{ width: `${(timeLeft / duration) * 100}%` }} />
                            </div>
                            <div className="time-left">{timeLeft}s</div>
                        </div>
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

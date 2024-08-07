import React, { useState, useEffect, useRef } from 'react';
import './game.scss';
import { useNavigate } from 'react-router-dom';
import Button from '../Default/Button';
import FallingObjectsContainer from './FallingObjectsContainer';
import axios from 'axios';
import { usePortal } from '../PortalContext/PortalContext';
import PortalGuard from './PortalGuard';
import { useNotifications } from '../Providers/NotificationContext';

interface GameProps {
    duration: number; // Длительность игры в секундах
    coinsPerClick: number; // Количество монет за клик
    maxTouches: number; // Максимальное количество точек касания
    multiplier: boolean; // Флаг для отображения и использования мультипликатора x2
}

const Game: React.FC<GameProps> = ({ duration, coinsPerClick, maxTouches, multiplier }) => {
    const { isOpen } = usePortal();
    const [userData, setUserData] = useState<any>(null);

    const [coins, setCoins] = useState<number>(0);
    const [bonusCoins, setBonusCoins] = useState<number>(0);
    const [rewardCoins, setRewardCoins] = useState<number>(0);
    const [scoreCoins, setScoreCoins] = useState<number>(0);
    const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);
    const [nextId, setNextId] = useState<number>(0);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number>(duration);
    const [showClaimButton, setShowClaimButton] = useState<boolean>(false);
    const [circleScale, setCircleScale] = useState<boolean>(false);
    const [coinContainerClicked, setCoinContainerClicked] = useState<boolean>(false);
    const [progressBarColor, setProgressBarColor] = useState<string>('');

    const [isClaimDisabled, setClaimDisabled] = useState(false);

    const navigate = useNavigate();
    const activeTouches = useRef<Set<number>>(new Set());
    const buttonRef = useRef<HTMLButtonElement>(null);

    const { addNotification } = useNotifications();

    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            setUserData(window.Telegram.WebApp.initDataUnsafe?.user);
        }
    }, []);

    const handleLink = (link: string) => {
        navigate(link);
    };

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
        setScoreCoins(prevCoins => prevCoins + totalCoins / (multiplier ? 2 : 1));
        setRewardCoins(prevCoins => prevCoins + totalCoins);
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
            setRewardCoins(prevCoins => prevCoins + coinsPerClick * (multiplier ? 2 : 1));
            setScoreCoins(prevCoins => prevCoins + coinsPerClick);
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
        }
    };

    const handleStartClick = () => {
        setGameStarted(true);
        setTimeLeft(duration); // Установите начальное время из пропса
    };

    const handleClaimClick = async (coins: number, points: number) => {
        setClaimDisabled(true);
        try {
            await axios.put(`${apiUrl}/api/balance/plus/${userData.id}`, { amount: coins });
            // Обновление или вставка баллов
            await axios.post(`${apiUrl}/api/leaderboard/leaderboard-update`, { telegram_id: userData.id, points });

            addNotification(`You got ${coins}!`, 'success');
        } catch (error) {
            console.error('Error:', error);
        }
        finally {
            setGameStarted(false);
            setShowClaimButton(false);
            setCoins(0);
            setBonusCoins(0);
            setRewardCoins(0);
            setScoreCoins(0);
            setClicks([]);
            if (!isOpen) {
                navigate("/game");
            }
        }
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

    const handleObjectCatch = (coinsToAdd: number) => {
        setBonusCoins(prevCoins => prevCoins + coinsToAdd * (multiplier ? 2 : 1));
        setRewardCoins(prevCoins => prevCoins + coinsToAdd * (multiplier ? 2 : 1));
        setScoreCoins(prevCoins => prevCoins + coinsToAdd);

        setCoinContainerClicked(true);
        setTimeout(() => {
            setCoinContainerClicked(false);
        }, 400);
    };

    return (
        <>
            <PortalGuard>
                {gameStarted && (
                    <div className='panel-wrapper'>
                        <div className='nav-wrapper'>
                            {coins}{bonusCoins}
                        </div>
                        <div className="progress-bar-wrapper">
                            <div className={`progress-bar-container ${progressBarColor}`}>
                                <div className="progress-bar" style={{ width: `${(timeLeft / duration) * 100}%` }} />
                            </div>
                        </div>
                    </div>
                )}
                <div className="game">
                    {!gameStarted && !showClaimButton && (
                        <div className='game-panel-container'>
                            <Button text="Play" custom={true} onClick={handleStartClick} />
                            <Button text="Leaderboard" custom={false} onClick={() => handleLink("/leaderboard")} />
                        </div>
                    )}
                    {gameStarted && (
                        <>
                            <div className='farm-panel'>
                                <div className='farm-container'>
                                    <div className={`coins-container ${coinContainerClicked ? 'scaled' : ''}`}>
                                        <div className="coins">{rewardCoins.toLocaleString(undefined)}</div>
                                        {multiplier && <div className="multiplier">x2</div>}
                                    </div>
                                    <div className="time-left">{timeLeft}s</div>
                                </div>
                                <div className='farm-container'>
                                    <div className={`count-coins ${coinContainerClicked ? 'scaled' : ''}`}>
                                        Score: <span className='purple-color'>{scoreCoins}</span>
                                    </div>
                                </div>
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
                                        <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute' }}>
                                            <defs>
                                                <filter id="hologram">
                                                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                                                    <feColorMatrix type="matrix" values="1 0 0 0 0
                                              0 1 0 0 0
                                              0 0 1 0 0
                                              1 0 0 0 0" result="colorShift" />
                                                    <feOffset in="colorShift" dx="5" dy="5" result="offsetBlur" />
                                                    <feBlend in="SourceGraphic" in2="offsetBlur" mode="screen" />
                                                </filter>
                                            </defs>
                                        </svg>
                                        <svg width="280" height="280" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 280" style={{ filter: 'url(#hologram)' }}>
                                            <defs>
                                                {/* Градиент для сияющего эффекта */}
                                                <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                                    <stop offset="0%" style={{ stopColor: '#CF00F8', stopOpacity: 1 }} />
                                                    <stop offset="70%" style={{ stopColor: 'transparent', stopOpacity: 0.5 }} />
                                                    <stop offset="100%" style={{ stopColor: 'transparent', stopOpacity: 0 }} />
                                                </radialGradient>
                                            </defs>
                                            {/* Фон */}
                                            <rect width="100%" height="100%" fill="transparent" />
                                            {/* Черная дыра */}
                                            <circle cx="140" cy="140" r="70" fill="black" />
                                            {/* Анимированное сияние */}
                                            <circle cx="140" cy="140" r="140" fill="url(#glowGradient)">
                                                <animate attributeName="r" dur="10s" values="220; 220; 220" repeatCount="indefinite" />
                                                <animate attributeName="opacity" dur="2s" values="1; 0.5; 1" repeatCount="indefinite" />
                                                <animateTransform attributeName="transform" type="rotate" dur="4s" from="360 100 140" to="360 100 140" repeatCount="indefinite" />
                                            </circle>
                                            {/* Черный круг внутри сияющего эффекта */}
                                            <circle cx="140" cy="140" r="54" fill="black" />
                                        </svg>
                                        {/* Конец SVG кода */}
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
                                    <FallingObjectsContainer onCatch={handleObjectCatch} />
                                </div>
                            </div>
                        </>
                    )}
                    {!gameStarted && showClaimButton && (
                        <div className='rewards'>
                            <div className='rewards-title'>Reward</div>
                            <div className='rewards-coins'>
                                {rewardCoins.toLocaleString(undefined)}
                                <div className={`count-coins ${coinContainerClicked ? 'scaled' : ''}`}>
                                    Score: <span className='purple-color'>{scoreCoins}</span>
                                </div>
                            </div>
                            <div className='rewards-actions'>
                                <Button text="Claim" custom={true} onClick={() => handleClaimClick(rewardCoins, scoreCoins)} disabled={isClaimDisabled} />
                            </div>
                        </div>
                    )}
                </div>
            </PortalGuard>
        </>
    );
};

export default Game;
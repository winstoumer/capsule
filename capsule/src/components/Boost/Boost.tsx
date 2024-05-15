import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './boost.scss';

interface UserData {
    balance: number;
    level: number;
}

interface Level {
    id: number;
    name: string;
    image: string;
    coins: number;
    time: number;
    mines_nft: boolean;
    price: number;
}

interface MiningData {
    active: boolean;
    nft_active: boolean;
    coins_mine: number;
    time_mine: number;
    next_time: string;
}

export const Boost: React.FC = () => {

    const [userData, setUserData] = useState<any>(null);
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    // -

    const [currentTime, setCurrentTime] = useState<string>("");
    const [nextTime, setNextTime] = useState<string | null>(null);
    const [coinsMine, setCoinsMine] = useState<number | null>(null);
    const [timeMine, setTimeMine] = useState<number | null>(null);

    const [hours, setHoursLeft] = useState<number>(0);
    const [minutes, setMinutesLeft] = useState<number>(0);
    const [seconds, setSecondsLeft] = useState<number>(0);

    const [timerFinished, setTimerFinished] = useState(false);

    const [value, setValue] = useState(0.000);

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            setUserData(window.Telegram.WebApp.initDataUnsafe?.user);
        }
    }, []);

    useEffect(() => {
        if (userData && userData.id) {
            fetchUserData(userData.id.toString());
        }
    }, [userData]);

    const fetchUserData = async (telegramUserId: string) => {
        try {
            const response = await axios.get(`https://capsule-server.onrender.com/api/user/info/${telegramUserId}`);
            setUser(response.data[0]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const levels: Level[] = [
        { id: 1, name: 'Level 1', image: 'capsule_v_1.png', coins: 100, time: 1, mines_nft: false, price: 160 },
        { id: 2, name: 'Level 2', image: 'capsule_v_2.png', coins: 200, time: 4, mines_nft: true, price: 340 }
    ];

    const currentLevelIndex = user ? levels.findIndex(level => level.id === user.level) : -1;
    const nextLevel = currentLevelIndex !== -1 ? levels[currentLevelIndex + 1] : null;
    const userLevel = currentLevelIndex !== -1 ? levels[currentLevelIndex] : null;

    const [animate, setAnimate] = useState(false);
    const [lastLevelAnimation, setLastLevelAnimation] = useState(false);

    const handleUpgrade = async () => {

        if (nextLevel && user && user.balance >= nextLevel.price) {
            try {
                if (coinsMine !== null && hours <= 0 && minutes <= 0 && seconds <= 0) {
                    await updateBalance(nextLevel.price);
                    await updateBalanceCoins(coinsMine);
                    await updateNextMining(nextLevel.id);
                }
                else {
                    await updateBalance(nextLevel.price);
                    await updateBalanceCoins(value);
                    await updateNextMining(nextLevel.id);
                }
                await updateLevel(nextLevel.id);
                setUser({ ...user, level: nextLevel.id, balance: user.balance - nextLevel.price });
                if (nextLevel.id !== levels[levels.length - 1].id) {
                    setAnimate(true);
                    setTimeout(() => {
                        setAnimate(false);
                    }, 500);
                }
            } catch (error) {
                console.error('Ошибка при обновлении уровня пользователя:', error);
                alert('Произошла ошибка при обновлении уровня пользователя');
            }
        } else if (nextLevel && user && user.balance < nextLevel.price) {
            alert('Недостаточно средств для покупки!');
        } else {
            alert('Вы достигли максимального уровня!');
        }
    };

    const updateBalanceCoins = async (coins: number) => {
        try {
            await axios.put(`https://capsule-server.onrender.com/api/balance/mined/${userData.id}`, { amount: coins });
        } catch (error) {
            throw error;
        }
    };

    const updateLevel = async (nextLevelId: number) => {
        try {
            await axios.put(`https://capsule-server.onrender.com/api/matter/upgrade/${userData.id}`, { matter_id: nextLevelId });
        } catch (error) {
            throw error;
        }
    };

    const updateBalance = async (price: number): Promise<void> => {
        try {
            await axios.put(`https://capsule-server.onrender.com/api/balance/${userData.id}`, { amount: price });
        } catch (error) {
            throw error;
        }
    };

    const updateNextMining = async (matterId: number): Promise<void> => {
        try {
            await axios.put(`https://capsule-server.onrender.com/api/currentMining/ready/${userData.id}`, { matter_id: matterId });
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        if (!nextLevel) {
            setLastLevelAnimation(true);
        } else {
            setLastLevelAnimation(false);
        }
    }, [nextLevel]);

    if (loading) {
        return <div></div>;
    }

    if (!user) {
        return <div>Данные о пользователе не найдены.</div>;
    }

    useEffect(() => {
        if (userData && userData.id) {
            fetchMiningData(userData.id.toString());
        }
    }, [userData]);

    const fetchMiningData = async (telegramUserId: string) => {
        try {
            const response = await fetch(`https://capsule-server.onrender.com/api/currentMining/ready/${telegramUserId}`);
            if (!response.ok) {
                throw new Error('Ошибка при загрузке данных о текущей активности');
            }
            const data: MiningData = await response.json();
            setNextTime(data.next_time);
            setCoinsMine(data.coins_mine);
            setTimeMine(data.time_mine);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCurrentTime();
    }, [])

    const fetchCurrentTime = async () => {
        try {
            const response = await fetch('https://capsule-server.onrender.com/api/currentTime');
            if (!response.ok) {
                throw new Error('Ошибка при получении текущего времени с сервера');
            }
            const data = await response.json();
            const currentTimeFormatted = data.currentTime.replace(' ', 'T');
            setCurrentTime(currentTimeFormatted);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const updateCountdown = () => {
            if (nextTime && currentTime) {
                const currentNowTime = new Date(currentTime.replace('T', ' ').replace('Z', ''));
                const currentNextTime = new Date(nextTime.replace('T', ' ').replace('Z', ''));
                let diffTime = currentNextTime.getTime() - currentNowTime.getTime();

                if (diffTime < 0) {
                    diffTime = 0;
                    setTimerFinished(true); // Установим флаг, что таймер закончился
                }

                const hours = Math.floor(diffTime / (1000 * 60 * 60));
                const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
                setHoursLeft(hours);
                setMinutesLeft(minutes);
                setSecondsLeft(seconds);
            }
        };

        updateCountdown();

        return () => updateCountdown();
    }, [nextTime, currentTime]);

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            if (hours === 0 && minutes === 0 && seconds === 0) {
                clearInterval(countdownInterval);
                setTimerFinished(true);
                return;
            }
    
            if (!timerFinished) {
                setSecondsLeft(prevSeconds => {
                    if (prevSeconds === 0) {
                        setMinutesLeft(prevMinutes => {
                            if (prevMinutes === 0) {
                                setHoursLeft(prevHours => Math.max(0, prevHours - 1));
                                return 59;
                            } else {
                                return prevMinutes - 1;
                            }
                        });
                        return 59;
                    } else {
                        return prevSeconds - 1;
                    }
                });
            }
        }, 1000);
    
        return () => clearInterval(countdownInterval);
    }, [hours, minutes, seconds, timerFinished]);    

    const coinsMinedSoFarRef = useRef<number>(0);

    useEffect(() => {
        if (coinsMine !== null && timeMine !== null) {
            const totalSecondsInTimeMine = timeMine * 3600;
            const passedSeconds = (hours * 3600) + (minutes * 60) + seconds;
            const remainingSeconds = totalSecondsInTimeMine - passedSeconds;

            coinsMinedSoFarRef.current = (coinsMine * remainingSeconds) / totalSecondsInTimeMine;
        }
    }, [coinsMine, timeMine, hours, minutes, seconds]);

    useEffect(() => {
        let isCoinsMineSet = false; // Флаг для отслеживания установки coinsMine

        if (coinsMine !== null && timeMine !== null) {
            const interval = setInterval(() => {
                const coinsPerSecond = (coinsMine / (timeMine * 3600)) / 2;

                if (!isCoinsMineSet && coinsMinedSoFarRef.current === coinsMine) {
                    // Установка coinsMine, если coinsMinedSoFarRef.current равен coinsMine
                    setValue(coinsMinedSoFarRef.current);
                    isCoinsMineSet = true; // Устанавливаем флаг в true, чтобы предотвратить повторную установку coinsMine
                }
                else {
                    coinsMinedSoFarRef.current += coinsPerSecond; // добавляем coinsPerSecond к coinsMinedSoFar
                    setValue(coinsMinedSoFarRef.current); // обновляем значение
                }

                if (coinsMine === coinsMinedSoFarRef.current) { // Проверяем, равны ли значения
                    setValue(coinsMine);
                    clearInterval(interval); // Останавливаем интервал
                }
            }, 500);

            return () => clearInterval(interval);
        }
    }, [coinsMine, timeMine]);

    return (
        <div className='default-page evently-container'>
            <div className='balance'>
                {user.balance}
            </div>
            <div className={`boost-container ${animate ? 'boost-container-animate' : ''}`}>
                {nextLevel ? (
                    <div className='boost-item'>
                        <img src={nextLevel.image} className='boost-item-image' alt="Boost Item" />
                    </div>
                ) : (
                    <div className='boost-item'>
                        <img src={userLevel!.image} className='boost-item-image' alt="Boost Item" />
                    </div>
                )}
                <div className='boost-info'>
                    {nextLevel ? (
                        <div className='boost-name'>{nextLevel.name}</div>
                    ) : (
                        <div className='boost-name'>{userLevel!.name}</div>
                    )}
                    {nextLevel ? (
                        <div className='boost-param'>{nextLevel.coins}/{nextLevel.time}h</div>
                    ) : (
                        <div className='boost-param'>{userLevel!.coins}/{userLevel!.time}h</div>
                    )}
                    {nextLevel && nextLevel.mines_nft ? (
                        <div className='boost-param'>
                            <span className='color-purple'>NFT</span>
                        </div>
                    ) : (
                        <div className='boost-param'>
                            <span className='color-purple'>NFT</span>
                        </div>
                    )}
                </div>
                <div className='price-item'>
                    {nextLevel ? (
                        <span className='color-blue'>{nextLevel.price}</span>
                    ) : null}
                </div>
                {nextLevel ? (
                    user.level < levels.length ? (
                        user.balance >= nextLevel.price ? (
                            <button className='default-button' onClick={handleUpgrade}>Upgrade</button>
                        ) : (
                            <Link to="/" className='default-button'>Mine</Link>
                        )
                    ) : null
                ) : (
                    <div className={`${lastLevelAnimation ? 'boost-last-level' : ''}`}></div>
                )}
            </div>
        </div>
    );
};

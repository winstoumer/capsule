import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './boost.scss';
import { Loading } from '../Loading/Loading';

interface UserData {
    balance: number;
    level: number;
}

interface CurrentTimeData {
    currentTime: string;
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
    matter_id: number;
    time_end_mined_nft: string;
    nft_mined: boolean;
    mint_active: boolean;
}

export const Boost: React.FC = () => {
    const [userData, setUserData] = useState<any>(null);
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    const [currentTime, setCurrentTime] = useState<string>("");
    const [nextTime, setNextTime] = useState<string | null>(null);
    const [coinsMine, setCoinsMine] = useState<number | null>(null);
    const [timeMine, setTimeMine] = useState<number | null>(null);
    const [matterId, setMatterId] = useState<number | null>(null);
    const [nftDate, setNftDate] = useState<Date | null>(null);
    const [nftEndDate, setNftEndDate] = useState<string | null>(null);
    const [nftMined, setNftMined] = useState(false);
    const [mintActive, setMintActive] = useState(false);

    const [hours, setHoursLeft] = useState<number>(0);
    const [minutes, setMinutesLeft] = useState<number>(0);
    const [seconds, setSecondsLeft] = useState<number>(0);

    const [timerFinished, setTimerFinished] = useState(false);
    const [value, setValue] = useState(0.000);

    const [animate, setAnimate] = useState(false);
    const [lastLevelAnimation, setLastLevelAnimation] = useState(false);

    const coinsMinedSoFarRef = useRef<number>(0);

    const [button, setButton] = useState(false);

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            setUserData(window.Telegram.WebApp.initDataUnsafe?.user);
        }
    }, []);

    useEffect(() => {
        if (userData && userData.id) {
            const telegramId = userData.id.toString();
            fetchUserData(telegramId);
            fetchMiningData(telegramId);
        }
    }, [userData]);

    useEffect(() => {
        fetchCurrentTime();
    }, []);

    useEffect(() => {
        const updateCountdown = () => {
            if (nextTime && currentTime) {
                const currentNowTime = new Date(currentTime.replace('T', ' ').replace('Z', ''));
                const currentNextTime = new Date(nextTime.replace('T', ' ').replace('Z', ''));
                let diffTime = currentNextTime.getTime() - currentNowTime.getTime();

                if (nftEndDate !== null) {
                    const currentNftEndDate = new Date(nftEndDate.replace('T', ' ').replace('Z', ''));
                    let diffTimeNft = currentNftEndDate.getTime() - currentNowTime.getTime();
                    if (mintActive === false && diffTimeNft < 0) {
                        setTimerFinished(true);
                        setMintActive(true);
                    }
                }

                if (diffTime < 0) {
                    diffTime = 0;
                    setTimerFinished(true);
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

    useEffect(() => {
        if (coinsMine !== null && timeMine !== null) {
            const totalSecondsInTimeMine = timeMine * 3600;
            const passedSeconds = (hours * 3600) + (minutes * 60) + seconds;
            const remainingSeconds = totalSecondsInTimeMine - passedSeconds;

            coinsMinedSoFarRef.current = (coinsMine * remainingSeconds) / totalSecondsInTimeMine;
        }
    }, [coinsMine, timeMine, hours, minutes, seconds]);

    useEffect(() => {
        let isCoinsMineSet = false;

        if (coinsMine !== null && timeMine !== null) {
            const interval = setInterval(() => {
                const coinsPerSecond = (coinsMine / (timeMine * 3600)) / 2;

                if (!isCoinsMineSet && coinsMinedSoFarRef.current === coinsMine) {
                    setValue(coinsMinedSoFarRef.current);
                    isCoinsMineSet = true;
                } else {
                    coinsMinedSoFarRef.current += coinsPerSecond;
                    setValue(coinsMinedSoFarRef.current);
                }

                if (coinsMine === coinsMinedSoFarRef.current) {
                    setValue(coinsMine);
                    clearInterval(interval);
                }
            }, 500);

            return () => clearInterval(interval);
        }
    }, [coinsMine, timeMine]);

    const fetchUserData = async (telegramUserId: string) => {
        try {
            const response = await axios.get(`https://capsule-server.onrender.com/api/user/info/${telegramUserId}`);
            setUser(response.data[0]);
        } catch (error) {
            console.error('Ошибка при загрузке данных пользователя:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMiningData = async (telegramUserId: string) => {
        try {
            const response = await axios.get<MiningData>(`https://capsule-server.onrender.com/api/currentMining/current/${telegramUserId}`);
            const data = response.data;

            setNextTime(data.next_time);
            setCoinsMine(data.coins_mine);
            setTimeMine(data.time_mine);
            setMatterId(data.matter_id);
            setNftEndDate(data.time_end_mined_nft);
            setNftMined(data.nft_mined);
            setMintActive(data.mint_active);
        } catch (error) {
            console.error('Ошибка при загрузке данных о текущей активности', error);
        }
    };

    const fetchCurrentTime = async () => {
        try {
            const response = await axios.get<CurrentTimeData>('https://capsule-server.onrender.com/api/currentTime');
            const data = response.data;
            const currentTimeFormatted = data.currentTime.replace(' ', 'T');
            setCurrentTime(currentTimeFormatted);
        } catch (error) {
            console.error('Ошибка при получении текущего времени с сервера', error);
        }
    };

    const updateBalanceCoins = async (coins: number) => {
        try {
            await axios.put(`https://capsule-server.onrender.com/api/balance/plus/${userData.id}`, { amount: coins });
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
            await axios.put(`https://capsule-server.onrender.com/api/balance/minus/${userData.id}`, { amount: price });
        } catch (error) {
            throw error;
        }
    };

    const updateMining = async (matterId: number, nftMined: boolean, nftDate: Date | null, mintActive: boolean): Promise<void> => {
        try {
            await axios.put(`https://capsule-server.onrender.com/api/currentMining/update/${userData.id}`,
                { matter_id: matterId, nft_mined: nftMined, time_end_mined_nft: nftDate, mint_active: mintActive });
        } catch (error) {
            throw error;
        }
    };

    const levels: Level[] = [
        { id: 1, name: 'Level 1', image: 'capsule_1.png', coins: 100, time: 1, mines_nft: false, price: 160 },
        { id: 2, name: 'Level 2', image: 'capsule_2.png', coins: 200, time: 4, mines_nft: true, price: 340 }
    ];

    const currentLevelIndex: number = user ? levels.findIndex(level => level.id === user.level) : -1;
    const nextLevel: Level | null = currentLevelIndex !== -1 ? levels[currentLevelIndex + 1] : null;
    const userLevel: Level | null = currentLevelIndex !== -1 ? levels[currentLevelIndex] : null;

    useEffect(() => {
        if (!nextLevel) {
            setLastLevelAnimation(true);
        } else {
            setLastLevelAnimation(false);
        }
    }, [nextLevel]);

    useEffect(() => {
        const generateNftDate = async () => {
            if (nextLevel && matterId && matterId < 2 && nextLevel.id < 2) {
                return;
            }

            if (nftDate) {
                return;
            }

            if (!currentTime) {
                return;
            }

            const endDate = new Date(currentTime);
            const startDate = new Date(currentTime);
            endDate.setDate(startDate.getDate() + 3);

            const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));

            setNftDate(randomDate);
        };

        generateNftDate();
    }, [nftDate, currentTime]);

    const handleUpgrade = async () => {
        setButton(true);
        if (nextLevel && user && user.balance >= nextLevel.price) {
            try {
                if (value !== null) {
                    await updateBalance(nextLevel.price);
                    await updateBalanceCoins(value);
                    if (nftDate && nextLevel !== null) {
                        if (nftMined && nftEndDate !== null && mintActive === false) {
                            const date = new Date(nftEndDate);
                            await updateMining(nextLevel.id, true, date, false);
                        }
                        else if (mintActive && nftEndDate !== null) {
                            const date = new Date(nftEndDate);
                            await updateMining(nextLevel.id, true, date, mintActive);
                        }
                        else {
                            await updateMining(nextLevel.id, true, nftDate, false);
                        }
                    } else {
                        if (nextLevel !== null && mintActive === false)
                            await updateMining(nextLevel.id, false, null, false);
                    }
                }
                await updateLevel(nextLevel.id);
                setUser({ ...user, level: nextLevel.id, balance: user.balance - nextLevel.price });
                if (nextLevel.id !== levels[levels.length - 1].id) {
                    setAnimate(true);
                    setTimeout(() => {
                        setAnimate(false);
                    }, 1000);
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

    if (loading) {
        return <Loading />;
    }

    if (!user) {
        return <div></div>;
    }

    return (
        <div className='default-page evently-container'>
            <div className='balance'>
                {Number(user.balance).toFixed(2)}
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
                            <div>
                                {
                                    !button && (
                                        <button className='default-button' onClick={handleUpgrade}>
                                            Upgrade
                                        </button>
                                    )
                                }
                            </div>
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

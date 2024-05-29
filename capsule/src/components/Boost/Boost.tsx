import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './boost.scss';
import { Link } from 'react-router-dom';
import { useCurrentTime } from '../CurrentTimeProvider/CurrentTimeContext';
import { useData } from '../DataProvider/DataContext';
import Balance from '../Balance/Balance';

interface Level {
    id: number;
    name: string;
    image: string;
    coins: number;
    time: number;
    mines_nft: boolean;
    price: number;
}

export const Boost: React.FC = () => {
    const { balanceData, userData, resetMineStates, fetchMiningData, nextTime, coinsMine, timeMine, matterId, nftEndDate, nftMined, mintActive: initialMintActive, level } = useData();
    const { currentTime, fetchCurrentTime, resetTimeStates } = useCurrentTime();

    const [mintActive, setMintActive] = useState<boolean>(initialMintActive ?? false);

    const [nftDate, setNftDate] = useState<Date | null>(null);

    const [hours, setHoursLeft] = useState<number>(0);
    const [minutes, setMinutesLeft] = useState<number>(0);
    const [seconds, setSecondsLeft] = useState<number>(0);

    const [value, setValue] = useState(0.00);
    const [isInitialized, setIsInitialized] = useState(false);

    const [animate, setAnimate] = useState(false);
    const [lastLevelAnimation, setLastLevelAnimation] = useState(false);

    const coinsMinedSoFarRef = useRef<number>(0);

    const [button, setButton] = useState(false);

    const [resetCountdown, setResetCountdown] = useState(false);

    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchCurrentTime();
    
        if (userData !== null) {
            fetchMiningData(userData.id.toString());
        }
    }, [fetchCurrentTime, fetchMiningData, userData]);    

    useEffect(() => {
        let countdownInterval: ReturnType<typeof setInterval>;

        const updateCountdown = () => {
            if (nextTime && currentTime) {
                const currentNowTime = new Date(currentTime.replace('T', ' ').replace('Z', ''));
                const currentNextTime = new Date(nextTime.replace('T', ' ').replace('Z', ''));
                let diffTime = currentNextTime.getTime() - currentNowTime.getTime();

                if (nftEndDate !== null) {
                    const currentNftEndDate = new Date(nftEndDate.replace('T', ' ').replace('Z', ''));
                    let diffTimeNft = currentNftEndDate.getTime() - currentNowTime.getTime();
                    if (!mintActive && diffTimeNft < 0) {
                        setMintActive(true);
                    }
                }

                if (diffTime < 0) {
                    diffTime = 0;
                }

                const updateTimer = () => {
                    diffTime -= 1000;

                    if (diffTime <= 0) {
                        clearInterval(countdownInterval);
                        setHoursLeft(0);
                        setMinutesLeft(0);
                        setSecondsLeft(0);
                        return;
                    }

                    const hours = Math.floor(diffTime / (1000 * 60 * 60));
                    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

                    setHoursLeft(hours);
                    setMinutesLeft(minutes);
                    setSecondsLeft(seconds);
                };

                updateTimer();
                countdownInterval = setInterval(updateTimer, 1000);
            }
        };

        updateCountdown();

        return () => {
            clearInterval(countdownInterval);
        };
    }, [nextTime, currentTime, resetCountdown, nftEndDate, mintActive, setMintActive]);

    useEffect(() => {
        if (coinsMine !== null && timeMine !== null) {
            const totalSecondsInTimeMine = timeMine * 3600;
            const passedSeconds = (hours * 3600) + (minutes * 60) + seconds;
            const remainingSeconds = totalSecondsInTimeMine - passedSeconds;
            const coinsPerSecond = (coinsMine / totalSecondsInTimeMine) / 2;

            coinsMinedSoFarRef.current = (coinsMine * remainingSeconds) / totalSecondsInTimeMine;
            setValue(coinsMinedSoFarRef.current);
            setIsInitialized(true);

            let isCoinsMineSet = false;
            const interval = setInterval(() => {
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
    }, [coinsMine, timeMine, hours, minutes, seconds]);

    const updateBalanceCoins = async (coins: number) => {
        try {
            if (userData !== null)
                await axios.put(`${apiUrl}/api/balance/plus/${userData.id}`, { amount: coins });
        } catch (error) {
            throw error;
        }
    };

    const updateLevel = async (nextLevelId: number) => {
        try {
            if (userData !== null)
                await axios.put(`${apiUrl}/api/matter/upgrade/${userData.id}`, { matter_id: nextLevelId });
        } catch (error) {
            throw error;
        }
    };

    const updateBalance = async (price: number): Promise<void> => {
        try {
            if (userData !== null)
                await axios.put(`${apiUrl}/api/balance/minus/${userData.id}`, { amount: price });
        } catch (error) {
            throw error;
        }
    };

    const updateMining = async (matterId: number, nftMined: boolean, nftDate: Date | null, mintActive: boolean): Promise<void> => {
        try {
            if (userData !== null)
                await axios.put(`${apiUrl}/api/currentMining/update/${userData.id}`,
                    { matter_id: matterId, nft_mined: nftMined, time_end_mined_nft: nftDate, mint_active: mintActive });
        } catch (error) {
            throw error;
        }
    };

    const levels: Level[] = [
        { id: 1, name: 'Level 1', image: 'capsule_1.png', coins: 100, time: 1, mines_nft: false, price: 100 },
        { id: 2, name: 'Level 2', image: 'capsule_2.png', coins: 200, time: 4, mines_nft: true, price: 200 },
        { id: 3, name: 'Level 3', image: 'capsule_3.png', coins: 500, time: 6, mines_nft: false, price: 800 },
        { id: 4, name: 'Level 4', image: 'capsule_4.png', coins: 1200, time: 8, mines_nft: true, price: 2300 },
        { id: 5, name: 'Level 5', image: 'capsule_5.png', coins: 3600, time: 12, mines_nft: true, price: 8000 }
    ];

    const currentLevelIndex: number = level !== undefined ? levels.findIndex(l => l.id === level) : -1;
    const nextLevel: Level | null = currentLevelIndex !== -1 && currentLevelIndex + 1 < levels.length ? levels[currentLevelIndex + 1] : null;
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

    const resetStatesBoost = () => {
        setResetCountdown(prev => !prev);
        setHoursLeft(0);
        setMinutesLeft(0);
        setSecondsLeft(0);
        setValue(0.000);
        setButton(false);
        setMintActive(false);
    };

    const handleUpgrade = async () => {
        setButton(true);
        if (nextLevel && balanceData >= nextLevel.price && userData) {
            try {
                if (value !== null) {
                    await updateBalance(nextLevel.price);
                    if (isInitialized)
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
                if (nextLevel.id !== levels[levels.length - 1].id) {
                    setAnimate(true);
                    setTimeout(() => {
                        setAnimate(false);
                    }, 1000);
                }
                resetStatesBoost();
                resetTimeStates();
                resetMineStates();
            } catch (error) {
                console.error('Ошибка при обновлении уровня пользователя:', error);
                alert('Произошла ошибка при обновлении уровня пользователя');
            }
        } else if (nextLevel && balanceData < nextLevel.price) {
            alert('Недостаточно средств для покупки!');
        } else {
            alert('Вы достигли максимального уровня!');
        }
    };

    return (
        <div className='default-page evently-container'>
            <Balance>
                {Number(balanceData).toFixed(2)}
            </Balance>
            <div className={`boost-container ${animate ? 'boost-container-animate' : ''}`}>
                {nextLevel ? (
                    <div className='boost-item'>
                        <img src={nextLevel.image} className='boost-item-image' alt="Boost Item" />
                    </div>
                ) : userLevel ? (
                    <div className='boost-item'>
                        <img src={userLevel.image} className='boost-item-image' alt="Boost Item" />
                    </div>
                ) : (
                    <div className='boost-item'>
                        <div className='boost-item-image'></div>
                    </div>
                )}
                <div className='boost-info'>
                    {nextLevel ? (
                        <div className='boost-name'>{nextLevel.name}</div>
                    ) : userLevel ? (
                        <div className='boost-name'>{userLevel.name}</div>
                    ) : (
                        <div className='boost-name'></div>
                    )}
                    {nextLevel ? (
                        <div className='boost-param'>{nextLevel.coins}/{nextLevel.time}h</div>
                    ) : userLevel ? (
                        <div className='boost-param'>{userLevel.coins}/{userLevel.time}h</div>
                    ) : (
                        <div className='boost-param'></div>
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
                {nextLevel && level !== null ? (
                    level < levels.length ? (
                        balanceData >= nextLevel.price ? (
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
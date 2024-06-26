import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './boost.scss';
import { Link } from 'react-router-dom';
import { useCurrentTime } from '../CurrentTimeProvider/CurrentTimeContext';
import { useData } from '../DataProvider/DataContext';
import ItemParameters from './ItemParameters';
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

const levels: Level[] = [
    { id: 1, name: 'M1', image: 'capsule_1.png', coins: 10, time: 1, mines_nft: false, price: 0 },
    { id: 2, name: 'M2', image: 'capsule_2.png', coins: 80, time: 4, mines_nft: false, price: 250 },
    { id: 3, name: 'M3', image: 'capsule_3.png', coins: 160, time: 6, mines_nft: true, price: 1400 },
    { id: 4, name: 'M4', image: 'capsule_4.png', coins: 420, time: 8, mines_nft: true, price: 3600 },
    { id: 5, name: 'M5', image: 'capsule_5.png', coins: 800, time: 12, mines_nft: true, price: 7200 }
];

export const Boost: React.FC = () => {
    const {
        balanceData,
        userData,
        resetMineStates,
        fetchMiningData,
        nextTime,
        coinsMine,
        timeMine,
        matterId,
        nftEndDate,
        nftMined,
        mintActive: initialMintActive,
        level
    } = useData();

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

    const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(level !== undefined ? levels.findIndex(l => l.id === level) : 0);
    const nextLevel: Level | null = currentLevelIndex + 1 < levels.length ? levels[currentLevelIndex + 1] : null;
    const previousLevel: Level | null = currentLevelIndex - 1 >= 0 ? levels[currentLevelIndex - 1] : null;
    const currentLevel: Level | undefined = levels[currentLevelIndex];

    useEffect(() => {
        const loadData = async () => {
            // Fetch current time
            await fetchCurrentTime();

            if (userData !== null) {
                await fetchMiningData(userData.id.toString());
            }
        };

        loadData();
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
                await axios.put(`${apiUrl}/api/currentMining/update/${userData.id}`, { matter_id: matterId, nft_mined: nftMined, time_end_mined_nft: nftDate, mint_active: mintActive });
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

    useEffect(() => {
        const generateNftDate = async () => {
            if (nextLevel && matterId && matterId < 3) {
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
            endDate.setDate(startDate.getDate() + 5);

            const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));

            setNftDate(randomDate);
        };

        generateNftDate();
    }, [currentTime, nextLevel, nftDate, setNftDate]);

    const resetStatesBoost = () => {
        setResetCountdown((prev) => !prev);
        setHoursLeft(0);
        setMinutesLeft(0);
        setSecondsLeft(0);
        setValue(0.000);
        setButton(false);
        setMintActive(false);
    };

    const handleUpgrade = async () => {
        setButton(true);
        if (nextLevel && balanceData >= nextLevel.price && userData && currentTime !== null) {
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
                console.error('An error occurred while updating the user level:', error);
                alert('An error occurred while updating the user level');
            }
        } else if (nextLevel && balanceData < nextLevel.price) {
            lastLevelAnimation === false;
            alert('Insufficient funds to purchase!');
        } else {
            alert('You have reached the maximum level!');
        }
    };

    const handleNextLevel = () => {
        if (nextLevel) {
            setCurrentLevelIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handlePreviousLevel = () => {
        if (previousLevel) {
            setCurrentLevelIndex((prevIndex) => prevIndex - 1);
        }
    };

    const PreviousArrow = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19L8 12L15 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    const NextArrow = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5L16 12L9 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    console.log('currentLevel:', currentLevel);

    return (
        <div className="evently-container">
            <div className={`boost-container ${animate ? 'boost-container-animate' : ''}`}>
                <Balance>
                    {Number(balanceData).toFixed(2)}
                </Balance>
                <div className="watch-levels">
                    <button className="button-arrow" onClick={handlePreviousLevel} disabled={!previousLevel}>
                        <PreviousArrow />
                    </button>
                    {(nextLevel || currentLevel) && currentLevel && (
                        <div className="boost-item">
                            <img src={currentLevel.image} className="boost-item-image" alt="Boost Item" />
                        </div>
                    )}
                    <button className="button-arrow" onClick={handleNextLevel} disabled={!nextLevel}>
                        <NextArrow />
                    </button>
                </div>
                {currentLevel && currentLevel.name && (
                    <div className="boost-name">{currentLevel.name}</div>
                )}
                {currentLevel && (
                    <div className="boost-info">
                        {currentLevel.coins !== undefined && (
                            <ItemParameters name="Coins" value={currentLevel.coins} />
                        )}
                        {currentLevel.time !== undefined && (
                            <ItemParameters name="Time" value={currentLevel.time} suffix="h" />
                        )}
                        {currentLevel.mines_nft !== undefined && (
                            <ItemParameters name="NFTs" value={currentLevel.mines_nft ? 'yes' : 'no'} />
                        )}
                    </div>
                )}
            </div>
            <div className='bottom-boost-action'>
                {nextLevel && nextLevel.price !== undefined && (
                    <div className="price-item">
                        <span>{nextLevel.price}</span>
                    </div>
                )}
                {nextLevel && currentLevelIndex !== null && level !== null && currentLevelIndex < levels.length && balanceData >= nextLevel.price && currentLevelIndex > level ? (
                    !button && <button className="default-button" onClick={handleUpgrade}>Upgrade</button>
                ) : (
                    <Link to="/" className="default-button">Mine</Link>
                )}
            </div>
        </div>
    );
};

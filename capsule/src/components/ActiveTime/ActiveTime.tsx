import './activeTime.scss';
import { useState, useEffect, useRef, useCallback } from 'react';
import ActiveMine from '../ActiveMine/ActiveMine';
import axios from 'axios';
import { useData } from '../DataProvider/DataContext';

interface MiningData {
    matter_id: number;
    active: boolean;
    nft_active: boolean;
    coins_mine: number;
    time_mine: number;
    next_time: string;
    time_end_mined_nft: string;
    nft_mined: boolean;
    mint_active: boolean;
}

export const ActiveTime = () => {
    const { resetBalanceStates } = useData();
    const [userData, setUserData] = useState<any>(null);
    const [nftActive, setNftActive] = useState(false);
    const [nextTime, setNextTime] = useState<string | null>(null);
    const [coinsMine, setCoinsMine] = useState<number | null>(null);
    const [timeMine, setTimeMine] = useState<number | null>(null);
    const [matterId, setMatterId] = useState<number | null>(null);
    const [nftMined, setNftMined] = useState(false);
    const [mintActive, setMintActive] = useState(false);

    const [hours, setHoursLeft] = useState<number>(0);
    const [minutes, setMinutesLeft] = useState<number>(0);
    const [seconds, setSecondsLeft] = useState<number>(0);

    const [timerFinished, setTimerFinished] = useState(false);

    const [value, setValue] = useState(0.00);

    const [nftDate, setNftDate] = useState<Date | null>(null);

    const [nftEndDate, setNftEndDate] = useState<string | null>(null);

    const coinsMinedSoFarRef = useRef<number>(0);

    const [button, setButton] = useState(false);
    const [buttonMintActive, setButtonMintActive] = useState(false);

    const [currentTime, setCurrentTime] = useState<string | null>(null);

    const fetchCurrentTime = useCallback(async () => {
        try {
            const response = await axios.get('https://capsule-server.onrender.com/api/currentTime');
            const currentTimeFormatted = response.data.currentTime.replace(' ', 'T');
            setCurrentTime(currentTimeFormatted);
        } catch (error) {
            console.error('Ошибка при получении текущего времени с сервера:', error);
        }
    }, []);

    useEffect(() => {
        fetchCurrentTime();
    }, [fetchCurrentTime]);

    const fetchMiningData = useCallback(async (telegramUserId: string) => {
        try {
            const response = await fetch(`https://capsule-server.onrender.com/api/currentMining/current/${telegramUserId}`);
            if (!response.ok) {
                throw new Error('Ошибка при загрузке данных о текущей активности');
            }
            const data: MiningData = await response.json();
            setNextTime(data.next_time);
            setCoinsMine(data.coins_mine);
            setTimeMine(data.time_mine);
            setMatterId(data.matter_id);
            setNftEndDate(data.time_end_mined_nft);
            setNftActive(data.nft_active);
            setNftMined(data.nft_mined);
            setMintActive(data.mint_active);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            setUserData(window.Telegram.WebApp.initDataUnsafe?.user);
        }
    }, []);

    useEffect(() => {
        if (userData && userData.id) {
            fetchMiningData(userData.id.toString());
        }
    }, [userData, fetchMiningData]);

    useEffect(() => {
        const updateCountdown = () => {
            if (nextTime && currentTime) {
                const currentNowTime = new Date(currentTime.replace('T', ' ').replace('Z', ''));
                const currentNextTime = new Date(nextTime.replace('T', ' ').replace('Z', ''));
                let diffTime = currentNextTime.getTime() - currentNowTime.getTime();

                if (nftEndDate !== null)
                {
                    const currentNftEndDate = new Date(nftEndDate.replace('T', ' ').replace('Z', ''));
                    let diffTimeNft = currentNftEndDate.getTime() - currentNowTime.getTime();
                    if (mintActive === false && diffTimeNft < 0)
                    {
                        setTimerFinished(true);
                        setMintActive(true);
                        setButtonMintActive(true);
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

                const countdownInterval = setInterval(() => {
                    const updatedDiffTime = diffTime - 1000;
                    if (hours === 0 && minutes === 0 && seconds === 0) {
                        clearInterval(countdownInterval);
                        setTimerFinished(true);
                        return;
                    }
                    if (updatedDiffTime < 0) {
                        clearInterval(countdownInterval);
                    } else {
                        diffTime = updatedDiffTime;
                        const updatedHours = Math.floor(diffTime / (1000 * 60 * 60));
                        const updatedMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
                        const updatedSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);
                        setHoursLeft(updatedHours);
                        setMinutesLeft(updatedMinutes);
                        setSecondsLeft(updatedSeconds);
                    }
                }, 1000);
            }
        };

        updateCountdown();

        return () => {};
    }, [nextTime, currentTime]);

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
                }
                else {
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

    useEffect(() => {
        const generateNftDate = async () => {
            if (matterId && matterId < 2) {
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
    }, [matterId, nftDate, currentTime]);

    const updateMining = async (matterId: number, nftMined: boolean, nftDate: Date | null, mintActive: boolean): Promise<void> => {
        try {
            const telegramId = userData.id;
            await axios.put(`https://capsule-server.onrender.com/api/currentMining/update/${telegramId}`,
                { matter_id: matterId, nft_mined: nftMined, time_end_mined_nft: nftDate, mint_active: mintActive });
            console.log('Update successful');
        } catch (error) {
            console.error('Error updating mining:', error);
        }
    };

    const updateBalance = async (coins: number): Promise<void> => {
        try {
            const telegramId = userData.id;
            await axios.put(`https://capsule-server.onrender.com/api/balance/plus/${telegramId}`, { amount: coins });
            console.log('Update successful');
        } catch (error) {
            console.error('Error updating balance:', error);
        }
    };

    const resetStatesHome = () => {
        setNextTime(null);
        setCoinsMine(null);
        setTimeMine(null);
        setMatterId(null);
        setHoursLeft(0);
        setMinutesLeft(0);
        setSecondsLeft(0);
        setTimerFinished(false);
        setValue(0.000);
        setNftDate(null);
        setNftEndDate(null);
        setButton(false);
        setMintActive(false);
        setButtonMintActive(false);
    };

    const handleClick = async () => {
        setButton(true);
        try {
            if (nftDate && matterId !== null) {
                if (nftMined && nftEndDate !== null && mintActive === false) {
                    const date = new Date(nftEndDate);
                    await updateMining(matterId, true, date, false);
                }
                else if (mintActive && nftEndDate !== null) {
                    const date = new Date(nftEndDate);
                    await updateMining(matterId, true, date, mintActive);
                }
                else {
                    await updateMining(matterId, true, nftDate, false);
                }
            } else {
                if (matterId !== null && mintActive === false)
                    await updateMining(matterId, false, null, false);
            }
            await updateBalance(value);
            fetchMiningData(userData.id.toString());
            resetStatesHome();
            fetchCurrentTime();
            resetBalanceStates();
        } catch (error) {
            console.error('Error updating', error);
        }
    };

    return (
        <>
            <div className='watch-capsule'>
                <img src="/capsule_1.png" className='always-capsule' alt="Capsule" />
            </div>
            <div className='active-time'>
                <div className='current-coins'>
                    {value.toFixed(2)}
                </div>
                <div className='time-left'>
                    {timerFinished ? <span></span> : (hours > 0 ? `${hours}h ${minutes}m ${seconds}s` : `${minutes}m`)}
                </div>
                <div className='info-for'>
                    {coinsMine}c/{timeMine}h
                </div>
                <div className='info-for position-top'>
                    {currentTime !== null && timerFinished && matterId !== null && value !== null ? (
                        <div>
                            {
                                !button && (
                                    <button className={buttonMintActive ? 'default-button' : 'default-button'} onClick={handleClick}>
                                        Claim
                                    </button>
                                )
                            }
                        </div>
                    ) : (
                        <ActiveMine nftEndDate={nftEndDate} nftActive={nftActive} />
                    )}
                </div>
            </div>
        </>
    );
};

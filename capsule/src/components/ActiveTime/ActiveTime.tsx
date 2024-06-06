import './activeTime.scss';
import { useState, useEffect, useRef } from 'react';
import ActiveMine from '../ActiveMine/ActiveMine';
import axios from 'axios';
import { useData } from '../DataProvider/DataContext';
import { useCurrentTime } from '../CurrentTimeProvider/CurrentTimeContext';
import TimerDisplay from '../TimerDisplay/TimerDisplay';

export const ActiveTime = () => {

    const apiUrl = import.meta.env.VITE_API_URL;

    const { userData, resetMineStates, fetchMiningData, nextTime, coinsMine, timeMine, matterId, nftEndDate, nftMined, mintActive: initialMintActive, nftActive, imageUrl } = useData();
    const { currentTime, fetchCurrentTime, resetTimeStates } = useCurrentTime();

    const [mintActive, setMintActive] = useState<boolean>(initialMintActive ?? false);

    const [hours, setHoursLeft] = useState<number>(0);
    const [minutes, setMinutesLeft] = useState<number>(0);
    const [seconds, setSecondsLeft] = useState<number>(0);

    const [timerFinished, setTimerFinished] = useState(false);

    const [value, setValue] = useState(0.00);
    const [isInitialized, setIsInitialized] = useState(false);

    const [nftDate, setNftDate] = useState<Date | null>(null);

    const coinsMinedSoFarRef = useRef<number>(0);

    const [button, setButton] = useState(false);
    const [buttonMintActive, setButtonMintActive] = useState(false);

    const [resetCountdown, setResetCountdown] = useState(false);

    useEffect(() => {
        fetchCurrentTime();
    }, [fetchCurrentTime]);

    useEffect(() => {
        if (userData !== null)
        fetchMiningData(userData?.id.toString());
    }, [fetchMiningData]);

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
                        setTimerFinished(true);
                        setMintActive(true);
                        setButtonMintActive(true);
                    }
                }

                if (diffTime < 0) {
                    diffTime = 0;
                    setTimerFinished(true);
                }

                const updateTimer = () => {
                    diffTime -= 1000;

                    if (diffTime <= 0) {
                        clearInterval(countdownInterval);
                        setTimerFinished(true);
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
    }, [nextTime, currentTime, resetCountdown, nftEndDate, mintActive, setMintActive, setButtonMintActive]);

    useEffect(() => {
        if (coinsMine !== null && timeMine !== null) {
            const totalSecondsInTimeMine = timeMine * 3600;
            const passedSeconds = (hours * 3600) + (minutes * 60) + seconds;
            const remainingSeconds = totalSecondsInTimeMine - passedSeconds;
            const coinsPerSecond = coinsMine / totalSecondsInTimeMine;
            const timeForIncrement = 0.01 / coinsPerSecond * 1000; // Время для добавления 0.01 монеты в миллисекундах
    
            coinsMinedSoFarRef.current = (coinsMine * remainingSeconds) / totalSecondsInTimeMine;
            setValue(coinsMinedSoFarRef.current);
            setIsInitialized(true);
    
            let isCoinsMineSet = false;
            const interval = setInterval(() => {
                if (!isCoinsMineSet && coinsMinedSoFarRef.current === coinsMine) {
                    setValue(coinsMinedSoFarRef.current);
                    isCoinsMineSet = true;
                } else {
                    coinsMinedSoFarRef.current += coinsPerSecond * (timeForIncrement / 1000); // Увеличиваем на соответствующее количество монет
                    setValue(coinsMinedSoFarRef.current);
                }
    
                if (coinsMine === coinsMinedSoFarRef.current) {
                    setValue(coinsMine);
                    clearInterval(interval);
                }
            }, timeForIncrement);
    
            return () => clearInterval(interval);
        }
    }, [coinsMine, timeMine, hours, minutes, seconds]);

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
            if (userData !== null)
            await axios.put(`${apiUrl}/api/currentMining/update/${userData.id}`,
                { matter_id: matterId, nft_mined: nftMined, time_end_mined_nft: nftDate, mint_active: mintActive });
            console.log('Update successful');
        } catch (error) {
            console.error('Error updating mining:', error);
        }
    };

    const updateBalance = async (coins: number): Promise<void> => {
        try {
            if (userData !== null)
            await axios.put(`${apiUrl}/api/balance/plus/${userData.id}`, { amount: coins });
            console.log('Update successful');
        } catch (error) {
            console.error('Error updating balance:', error);
        }
    };

    const resetStatesHome = () => {
        setResetCountdown(prev => !prev);
        setHoursLeft(0);
        setMinutesLeft(0);
        setSecondsLeft(0);
        setTimerFinished(false);
        setValue(0.00);
        setNftDate(null);
        setButton(false);
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
            resetStatesHome();
            resetTimeStates();
            resetMineStates();
        } catch (error) {
            console.error('Error updating', error);
        }
    };

    return (
        <>
            <div className='watch-matter'>
                <img src={imageUrl ?? undefined} className='always-matter' />
            </div>
            <div className='active-time'>
                <div className='current-coins' style={{ transform: 'perspective(400px) rotateX(30deg)', transformOrigin: 'top' }}>
                    {isInitialized ? value.toFixed(2) : null}
                </div>
                <div className='time-left'>
                    <TimerDisplay timerFinished={timerFinished} hours={hours} minutes={minutes} seconds={seconds}/>
                </div>
                <div className='info-for'>
                    {coinsMine}/{timeMine}h
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

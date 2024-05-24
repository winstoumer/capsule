import './activeTime.scss';
import { useState, useEffect, useRef } from 'react';
import { useCurrentTime } from '../CurrentTimeProvider/CurrentTimeContext';
import ActiveMine from '../ActiveMine/ActiveMine';
import axios from 'axios';
import { useData } from '../DataProvider/DataContext';

export const ActiveTime = () => {
    const { currentTime, resetTimeStates } = useCurrentTime();
    const { userData, resetMineStates,
        nextTime,
        coinsMine,
        timeMine,
        matterId,
        nftEndDate,
        nftMined,
        mintActive,
        nftActive } = useData();

    const [hours, setHoursLeft] = useState<number>(0);
    const [minutes, setMinutesLeft] = useState<number>(0);
    const [seconds, setSecondsLeft] = useState<number>(0);

    const [timerFinished, setTimerFinished] = useState(false);

    const [value, setValue] = useState(0.00);

    const [nftDate, setNftDate] = useState<Date | null>(null);

    const coinsMinedSoFarRef = useRef<number>(0);

    const [button, setButton] = useState(false);
    const [buttonMintActive, setButtonMintActive] = useState(false);

    useEffect(() => {
        const updateCountdown = () => {
            if (nextTime && currentTime) {
                const currentNowTime = new Date(currentTime);
                const currentNextTime = new Date(nextTime);
                let diffTime = currentNextTime.getTime() - currentNowTime.getTime();

                if (nftEndDate !== null) {
                    const currentNftEndDate = new Date(nftEndDate);
                    let diffTimeNft = currentNftEndDate.getTime() - currentNowTime.getTime();
                    if (mintActive === false && diffTimeNft < 0) {
                        setTimerFinished(true);
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
            }
        };

        updateCountdown();

        const countdownInterval = setInterval(() => {
            updateCountdown();
        }, 1000);

        return () => clearInterval(countdownInterval);
    }, [nextTime, currentTime, nftEndDate, mintActive]);

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
            if (userData !== null)
                await axios.put(`https://capsule-server.onrender.com/api/currentMining/update/${userData.id}`,
                    { matter_id: matterId, nft_mined: nftMined, time_end_mined_nft: nftDate, mint_active: mintActive });
            console.log('Update successful');
        } catch (error) {
            console.error('Error updating mining:', error);
        }
    };

    const updateBalance = async (coins: number): Promise<void> => {
        try {
            if (userData !== null)
                await axios.put(`https://capsule-server.onrender.com/api/balance/plus/${userData.id}`, { amount: coins });
            console.log('Update successful');
        } catch (error) {
            console.error('Error updating balance:', error);
        }
    };

    const resetStatesHome = () => {
        setHoursLeft(0);
        setMinutesLeft(0);
        setSecondsLeft(0);
        setTimerFinished(false);
        setValue(0.000);
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
            resetTimeStates();
            resetMineStates();
            resetStatesHome();
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

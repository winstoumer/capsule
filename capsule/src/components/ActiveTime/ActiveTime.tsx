import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './activeTime.scss';
import ClaimButton from '../Buttons/ClaimButton';

interface MiningData {
    matter_id: number;
    active: boolean;
    nft_active: boolean;
    coins_mine: number;
    time_mine: number;
    next_time: string;
    time_end_mined_nft: string;
}

const fetchJSON = async (url: string) => {
    const response = await axios.get(url);
    return response.data;
};

const calculateTimeDiff = (endTime: Date, startTime: Date) => {
    const diff = endTime.getTime() - startTime.getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneHour = 60 * 60 * 1000;
    if (diff > oneDay) return `~ ${Math.floor(diff / oneDay)} days`;
    if (diff > oneHour) return `~ ${Math.floor(diff / oneHour)} hours`;
    return diff > 0 ? `(~ soon)` : "";
};

export const ActiveTime = () => {
    const [userData, setUserData] = useState<any>(null);
    const [activeText, setActiveText] = useState("Active..");
    const [currentTime, setCurrentTime] = useState<string>("");
    const [nextTime, setNextTime] = useState<string | null>(null);
    const [coinsMine, setCoinsMine] = useState<number | null>(null);
    const [timeMine, setTimeMine] = useState<number | null>(null);
    const [matterId, setMatterId] = useState<number | null>(null);

    const [hours, setHoursLeft] = useState<number>(0);
    const [minutes, setMinutesLeft] = useState<number>(0);
    const [seconds, setSecondsLeft] = useState<number>(0);

    const [timerFinished, setTimerFinished] = useState(false);

    const [value, setValue] = useState(0.000);

    // Generate Nft
    const [nftDate, setNftDate] = useState<Date | null>(null);

    // Time Nft End
    const [nftEndDate, setNftEndDate] = useState<string | null>(null);

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            setUserData(window.Telegram.WebApp.initDataUnsafe?.user);
        }
    }, []);

    useEffect(() => {
        if (userData && userData.id) {
            fetchMiningData(userData.id.toString());
        }
    }, [userData]);

    const fetchMiningData = async (telegramUserId: string) => {
        try {
            const data: MiningData = await fetchJSON(`https://capsule-server.onrender.com/api/currentMining/current/${telegramUserId}`);
            setNextTime(data.next_time);
            setCoinsMine(data.coins_mine);
            setTimeMine(data.time_mine);
            setMatterId(data.matter_id);
            setNftEndDate(data.time_end_mined_nft);
            const remainingTime = calculateTimeDiff(new Date(data.time_end_mined_nft), new Date(currentTime));
            setActiveText(data.active ? `Active..` : (data.nft_active ? `Mined nft.. ${remainingTime}` : ""));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const remainingTime = calculateTimeDiff(new Date(nftEndDate || ''), new Date());
            setActiveText(prevText => prevText === "Active.." ? `Mined nft.. ${remainingTime}` : "Active..");
        }, 2000);
        return () => clearInterval(interval);
    }, [currentTime, nftEndDate]);

    useEffect(() => {
        fetchCurrentTime();
    }, []);

    const fetchCurrentTime = async () => {
        try {
            const data = await fetchJSON('https://capsule-server.onrender.com/api/currentTime');
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

        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
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
            if (matterId && matterId < 2) return;
            if (nftDate) return;
            if (!currentTime) return;

            const endDate = new Date(currentTime);
            const startDate = new Date(currentTime);
            endDate.setDate(startDate.getDate() + 3);

            const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
            setNftDate(randomDate);
        };

        generateNftDate();
    }, [matterId, nftDate, currentTime]);

    return (
        <>
            <div className='watch-capsule'>
                <img src="/capsule_v_2.png" className='always-capsule' alt="Capsule" />
            </div>
            <div className='active-time'>
                <div className='current-coins'>{value.toFixed(3)}</div>
                <div className='time-left'>
                    {timerFinished ? <span></span> : (hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`)}
                </div>
                <div className='info-for'>{coinsMine}c/{timeMine}h</div>
                <div className='info-for position-top'>
                    {timerFinished && matterId !== null && value !== null && currentTime !== "" && (
                        <ClaimButton telegramId={userData.id} matterId={matterId} coins={value} nftDate={nftDate} />
                    )}
                </div>
                <div className='info-for'>
                    {timerFinished ? <span></span> : <div className={`active-signal ${activeText.includes("nft") ? 'color-purple' : ''}`}>{activeText}</div>}
                </div>
            </div>
        </>
    );
};

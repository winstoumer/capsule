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
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [nextTime, setNextTime] = useState<Date | null>(null);
    const [coinsMine, setCoinsMine] = useState<number | null>(null);
    const [timeMine, setTimeMine] = useState<number | null>(null);
    const [matterId, setMatterId] = useState<number | null>(null);
    const [nftEndDate, setNftEndDate] = useState<Date | null>(null);
    const [timerFinished, setTimerFinished] = useState(false);
    const [value, setValue] = useState(0.000);
    const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

    const coinsMinedSoFarRef = useRef<number>(0);

    useEffect(() => {
        if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
            setUserData(window.Telegram.WebApp.initDataUnsafe.user);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!userData?.id) return;
            try {
                const data: MiningData = await fetchJSON(`https://capsule-server.onrender.com/api/currentMining/current/${userData.id}`);
                setNextTime(new Date(data.next_time));
                setCoinsMine(data.coins_mine);
                setTimeMine(data.time_mine);
                setMatterId(data.matter_id);
                setNftEndDate(new Date(data.time_end_mined_nft));
                setActiveText(data.active ? `Active..` : (data.nft_active ? `Mined nft.. ${calculateTimeDiff(new Date(data.time_end_mined_nft), new Date())}` : ""));
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [userData]);

    useEffect(() => {
        const fetchTime = async () => {
            try {
                const data = await fetchJSON('https://capsule-server.onrender.com/api/currentTime');
                setCurrentTime(new Date(data.currentTime.replace(' ', 'T')));
            } catch (error) {
                console.error(error);
            }
        };
        fetchTime();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!nextTime || !currentTime) return;
            const now = new Date();
            const timeDiff = nextTime.getTime() - now.getTime();
            if (timeDiff <= 0) {
                setCountdown({ hours: 0, minutes: 0, seconds: 0 });
                setTimerFinished(true);
                clearInterval(interval);
                return;
            }
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
            setCountdown({ hours, minutes, seconds });
        }, 1000);
        return () => clearInterval(interval);
    }, [nextTime, currentTime]);

    useEffect(() => {
        if (coinsMine === null || timeMine === null) return;
        const totalSeconds = timeMine * 3600;
        const coinsPerSecond = coinsMine / totalSeconds;
        const interval = setInterval(() => {
            coinsMinedSoFarRef.current += coinsPerSecond;
            setValue(coinsMinedSoFarRef.current);
            if (coinsMinedSoFarRef.current >= coinsMine) {
                setValue(coinsMine);
                clearInterval(interval);
            }
        }, 500);
        return () => clearInterval(interval);
    }, [coinsMine, timeMine]);

    return (
        <>
            <div className='watch-capsule'>
                <img src="/capsule_v_2.png" className='always-capsule' alt="Capsule" />
            </div>
            <div className='active-time'>
                <div className='current-coins'>{value.toFixed(3)}</div>
                <div className='time-left'>
                    {timerFinished ? <span></span> : (countdown.hours > 0 ? `${countdown.hours}h ${countdown.minutes}m` : `${countdown.minutes}m`)}
                </div>
                <div className='info-for'>{coinsMine}c/{timeMine}h</div>
                <div className='info-for position-top'>
                    {timerFinished && matterId !== null && value !== null && currentTime && (
                        <ClaimButton telegramId={userData.id} matterId={matterId} coins={value} nftDate={nftEndDate} />
                    )}
                </div>
                <div className='info-for'>
                    {timerFinished ? <span></span> : <div className={`active-signal ${activeText.includes("nft") ? 'color-purple' : ''}`}>{activeText}</div>}
                </div>
            </div>
        </>
    );
};

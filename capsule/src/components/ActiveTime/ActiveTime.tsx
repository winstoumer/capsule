import { useState, useEffect } from 'react';
import './activeTime.scss';

interface MiningData {
    active: boolean;
    nft_active: boolean;
    coins_mine: number;
    time_mine: number;
    next_time: string;
}

export const ActiveTime = () => {
    const [userData, setUserData] = useState<any>(null);
    const [activeText, setActiveText] = useState("Active..");
    const [miningInfo, setMiningInfo] = useState<MiningData | null>(null);
    const [currentTime, setCurrentTime] = useState<string>("");
    const [nextTime, setNextTime] = useState<string | null>(null);

    const [hours, setHoursLeft] = useState<number>(0);
    const [minutes, setMinutesLeft] = useState<number>(0);
    //const [seconds, setSecondsLeft] = useState<number>(0);

    const [timerFinished, setTimerFinished] = useState(false);

    const [currentCoinsMined, setCurrentCoinsMined] = useState(0);

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
            const response = await fetch(`https://capsule-server.onrender.com/api/currentMining/ready/${telegramUserId}`);
            if (!response.ok) {
                throw new Error('Ошибка при загрузке данных о текущей активности');
            }
            const data: MiningData = await response.json();
            setNextTime(data.next_time);
            setMiningInfo(data);
            setActiveText(data.active ? "Active.." : (data.nft_active ? "Mined nft.." : ""));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveText(prevText => prevText === "Active.." ? "Mined nft.." : "Active..");
        }, 2000);
        return () => clearInterval(interval);
    }, []);

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
                //const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
                setHoursLeft(hours);
                setMinutesLeft(minutes);
                //setSecondsLeft(seconds);
            }
        };

        updateCountdown();

        return () => updateCountdown();
    }, [nextTime, currentTime]);

    useEffect(() => {
        const updateCoinsMined = () => {
            if (nextTime && miningInfo) {
                const currentNowTime = new Date(currentTime);
                const currentNextTime = new Date(nextTime);
                let diffTimeInSeconds = (currentNowTime.getTime() - currentNextTime.getTime()) / 1000;
                if (diffTimeInSeconds < 0) {
                    diffTimeInSeconds = 0;
                }
                const maxCoinsToMine = miningInfo.coins_mine;
                const elapsedTimeInSeconds = miningInfo.time_mine * 3600 - diffTimeInSeconds;
                const coinsPerSecond = maxCoinsToMine / (miningInfo.time_mine * 3600);
                let coinsMinedSoFar = Math.min(maxCoinsToMine, Math.floor(coinsPerSecond * elapsedTimeInSeconds));

                setCurrentCoinsMined(coinsMinedSoFar);
            }
        };

        updateCoinsMined();
        const intervalId = setInterval(updateCoinsMined, 1000);
        return () => clearInterval(intervalId);
    }, [nextTime, miningInfo]);

    return (
        <>
            <div className='watch-capsule'>
                <img src="/capsule_v_2.png" className='always-capsule' alt="Capsule" />
            </div>
            <div className='active-time'>
                <div className='time-left'> {currentCoinsMined} Coins
                    {timerFinished ? <span>0h 0m</span> : `${hours < 10 ? '' + hours : hours}h ${minutes < 10 ? '0' + minutes : minutes}m`}
                </div>
                <div className='info-for'>
                    {miningInfo?.coins_mine}/{miningInfo?.time_mine}h
                </div>
                <div className='info-for position-top '>
                    {timerFinished && <button className='default-button'>Claim</button>}
                </div>
                <div className='info-for'>
                    {timerFinished ? <span></span> : <div className={`active-signal ${activeText === "Mined nft.." ? 'color-purple' : ''}`}>{activeText}</div>}
                </div>
            </div>
        </>
    );
};
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
    const [currentCoinsMined, setCurrentCoinsMined] = useState<number>(0);
    const [coins, setCoinsMined] = useState<number>(0);
    const [nowDate, setNowDate] = useState<string>("");

    const [hours, setHoursLeft] = useState<number>(0);
    const [minutes, setMinutesLeft] = useState<number>(0);
    const [seconds, setSecondsLeft] = useState<number>(0);

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
            const response = await fetch(`https://elaborate-gabriel-webapp-091be922.koyeb.app/api/currentMining/ready/${telegramUserId}`);
            if (!response.ok) {
                throw new Error('Ошибка при загрузке данных о текущей активности');
            }
            const data: MiningData = await response.json();
            const currentTimeFormatted = data.next_time.replace(' ', 'T');
            const nextTimeUTC = new Date(currentTimeFormatted);

            setNextTime(nextTimeUTC.toISOString());
            localStorage.setItem('nextTime', nextTimeUTC.toISOString());

            const storedNextTime = localStorage.getItem('nextTime');
            if (storedNextTime) {
                setNextTime(storedNextTime);
            }

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
    }, []);

    const fetchCurrentTime = async () => {
        try {
            const response = await fetch('https://elaborate-gabriel-webapp-091be922.koyeb.app/api/currentTime');
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
        let timeoutId: NodeJS.Timeout;
    
        const updateCountdown = () => {
            if (nextTime && currentTime) {
                const currentNowTime = new Date(currentTime.replace('T', ' ').replace('Z', ''));
                const currentNextTime = new Date(nextTime.replace('T', ' ').replace('Z', ''));
                const diffTime = currentNextTime.getTime() - currentNowTime.getTime();
    
                if (diffTime > 0) {
                    const hours = Math.floor(diffTime / (1000 * 60 * 60));
                    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
                    setHoursLeft(hours);
                    setMinutesLeft(minutes);
                    setSecondsLeft(seconds);
    
                    timeoutId = setTimeout(updateCountdown, 1000);
                } else {
                    // Время истекло, можем выполнить необходимые действия
                }
            }
        };
    
        updateCountdown();
    
        return () => clearTimeout(timeoutId);
    }, [nextTime, currentTime]);          

    useEffect(() => {
        const updateCoinsMined = () => {
            if (miningInfo && nextTime && currentTime) {
                const currentNowTime = new Date(currentTime.replace('T', ' ').replace('Z', ''));
                const currentNextTime = new Date(nextTime.replace('T', ' ').replace('Z', ''));
                let diffTimeInSeconds = (currentNextTime.getTime() - currentNowTime.getTime()) / 1000;
                if (diffTimeInSeconds < 0) {
                    diffTimeInSeconds = 0; // Если currentTime позже, чем nextTime, считаем, что разница времени равна 0
                }
                const coinsPerSecond = miningInfo.coins_mine / (miningInfo.time_mine * 3600); // монет в секунду
                const coinsMinedSoFar = Math.floor(coinsPerSecond * (miningInfo.time_mine * 3600 - diffTimeInSeconds)); // округляем вниз
                setCurrentCoinsMined(coinsMinedSoFar);
            }
        };
    
        updateCoinsMined();
        const intervalId = setInterval(updateCoinsMined, 1000);
        return () => clearInterval(intervalId);
    }, [nextTime, currentTime, miningInfo]);

    
    return (
        <>
            <div className='watch-capsule'>
                <img src="/capsule_v_1.png" className='always-capsule' alt="Capsule" />
            </div>
            <div className='active-time'>
                <div className='time-left'>
                     {currentTime}
                </div>
                <div className='time-left'>
                     {currentCoinsMined.toFixed(3)}
                </div>
                <div className='time-left'>
                {`${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`}
                </div>
                <div className='info-for'>
                    {miningInfo?.coins_mine}/{miningInfo?.time_mine}h
                </div>
                <div className={`active-signal ${activeText === "Mined nft.." ? 'color-purple' : ''}`}>
                    {activeText}
                </div>
            </div>
        </>
    );
};

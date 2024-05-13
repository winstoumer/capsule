import { useState, useEffect } from 'react';
import ntpClient from 'ntp-client';
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
    const [timeToNext, setTimeToNext] = useState<{ hours: number, minutes: number }>({ hours: 0, minutes: 0 });

    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        ntpClient.getNetworkTime("pool.ntp.org", 123, function (err: string | Error | null, date: Date | null) {
            if (err || !date) {
                console.error(err);
                return;
            }
            setCurrentTime(date);
        });
    }, []);

    const formatTimeUTC = (time: Date): string => {
        const year = time.getUTCFullYear();
        const month = (time.getUTCMonth() + 1).toString().padStart(2, '0'); // Месяц начинается с 0
        const day = time.getUTCDate().toString().padStart(2, '0');
        const hours = time.getUTCHours().toString().padStart(2, '0');
        const minutes = time.getUTCMinutes().toString().padStart(2, '0');
        const seconds = time.getUTCSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };    

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
    });

    useEffect(() => {
        if (miningInfo?.next_time) {
            const currentTime = new Date();
            const nextTime = new Date(miningInfo.next_time);
            const diffTime = Math.max(nextTime.getTime() - currentTime.getTime(), 0);
            const hours = Math.floor(diffTime / (1000 * 60 * 60));
            const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
            setTimeToNext({ hours, minutes });
        }
    }, [miningInfo]);

    return (
        <>
            <div className='watch-capsule'>
                <img src="/capsule_v_1.png" className='always-capsule' alt="Capsule" />
            </div>
            <div className='active-time'>
                <div>
                    {currentTime ? (
                        <div>Текущее время: {formatTimeUTC(currentTime)}</div>
                    ) : (
                        <div>Загрузка времени...</div>
                    )}
                </div>
                <div className='time-left'>
                    {timeToNext.hours}h {timeToNext.minutes}m
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
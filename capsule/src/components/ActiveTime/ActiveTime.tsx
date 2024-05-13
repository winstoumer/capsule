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
    const [miningInfo, setMiningInfo] = useState<MiningData | null>(null);
    const [currentTime, setCurrentTime] = useState<string>("");
    const [countdown, setCountdown] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prev) => (prev === 1 ? 0 : 1));
        }, 2000);
        return () => clearInterval(interval);
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
    }, [userData]);

    useEffect(() => {
        fetchCurrentTime();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const updatedTime = new Date(currentTime || 0);
            const nextTime = new Date(miningInfo?.next_time || 0);
            const diff = nextTime.getTime() - updatedTime.getTime();
            setCountdown(Math.max(0, Math.floor(diff / 1000)));
        }, 1000);
        return () => clearInterval(interval);
    }, [miningInfo, currentTime]);    

    const fetchMiningData = async (telegramUserId: string) => {
        try {
            const response = await fetch(`https://elaborate-gabriel-webapp-091be922.koyeb.app/api/currentMining/ready/${telegramUserId}`);
            if (!response.ok) {
                throw new Error('Ошибка при загрузке данных о текущей активности');
            }
            const data: MiningData = await response.json();
            setMiningInfo(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCurrentTime = async () => {
        try {
            const response = await fetch('https://elaborate-gabriel-webapp-091be922.koyeb.app/api/currentTime');
            if (!response.ok) {
                throw new Error('Ошибка при получении текущего времени с сервера');
            }
            const { currentTime } = await response.json();
            setCurrentTime(currentTime);
        } catch (error) {
            console.error(error);
        }
    };

    const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

    const hours = Math.floor(countdown / 3600);
    const minutes = Math.floor((countdown % 3600) / 60);
    const seconds = countdown % 60;

    return (
        <>
            <div className='watch-capsule'>
                <img src="/capsule_v_1.png" className='always-capsule' alt="Capsule" />
            </div>
            <div className='active-time'>
                <div className='time-left'>
                    {`${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`}
                </div>
                <div className='info-for'>
                    {miningInfo?.coins_mine}/{miningInfo?.time_mine}h
                </div>
                <div className={`active-signal ${miningInfo?.active ? '' : 'color-purple'}`}>
                    {miningInfo?.active ? 'Active..' : 'Mined nft..'}
                </div>
            </div>
        </>
    );
};

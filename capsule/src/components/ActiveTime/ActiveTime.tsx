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
    const [timeToNext, setTimeToNext] = useState<{ hours: number, minutes: number, seconds: number }>({ hours: 0, minutes: 0, seconds: 0 });
    const [currentTime, setCurrentTime] = useState<string>("");

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
        fetchCurrentTime();
    }, []);

    const fetchCurrentTime = async () => {
        try {
            const response = await fetch('https://elaborate-gabriel-webapp-091be922.koyeb.app/api/currentTime');
            if (!response.ok) {
                throw new Error('Ошибка при получении текущего времени с сервера');
            }
            const data = await response.json();
            setCurrentTime(data.currentTime);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (miningInfo?.next_time) {
            const updateCountdown = () => {
                const currentNowTime = new Date(currentTime);
                const nextTime = new Date(miningInfo.next_time.replace('T', ' ').replace('Z', ''));
                const diffTime = Math.max(nextTime.getTime() - currentNowTime.getTime(), 0);
                const hours = Math.floor(diffTime / (1000 * 60 * 60));
                const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
                setTimeToNext({ hours, minutes, seconds });
            };

            updateCountdown();

            // Выполняем обновление времени каждую секунду
            const intervalId = setInterval(updateCountdown, 1000);

            // Убираем интервал при размонтировании компонента
            return () => clearInterval(intervalId);
        }
    }, [miningInfo, currentTime]);


    return (
        <>
            <div className='watch-capsule'>
                <img src="/capsule_v_1.png" className='always-capsule' alt="Capsule" />
            </div>
            <div className='active-time'>
                <div className='time-left'>
                    {timeToNext.hours}h {timeToNext.minutes}m {timeToNext.seconds}s
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
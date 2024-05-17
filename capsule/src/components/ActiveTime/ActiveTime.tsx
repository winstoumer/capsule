import { useState, useEffect, useRef } from 'react';
import './activeTime.scss';
import ClaimButton from '../Buttons/ClaimButton';

interface MiningData {
    matter_id: number;
    active: boolean;
    nft_active: boolean;
    coins_mine: number;
    time_mine: number;
    next_time: string;
}

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
            const response = await fetch(`https://capsule-server.onrender.com/api/currentMining/current/${telegramUserId}`);
            if (!response.ok) {
                throw new Error('Ошибка при загрузке данных о текущей активности');
            }
            const data: MiningData = await response.json();
            setNextTime(data.next_time);
            setCoinsMine(data.coins_mine);
            setTimeMine(data.time_mine);
            setMatterId(data.matter_id);
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
                const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
                setHoursLeft(hours);
                setMinutesLeft(minutes);
                setSecondsLeft(seconds);
            }
        };

        updateCountdown();

        return () => updateCountdown();
    }, [nextTime, currentTime]);

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            if (hours === 0 && minutes === 0 && seconds === 0) {
                clearInterval(countdownInterval);
                setTimerFinished(true); // установка состояния timerFinished в true, когда таймер закончился
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

    const coinsMinedSoFarRef = useRef<number>(0); // используем useRef для сохранения значения между вызовами useEffect

    useEffect(() => {
        if (coinsMine !== null && timeMine !== null) {
            const totalSecondsInTimeMine = timeMine * 3600; // общее количество секунд в timeMine
            const passedSeconds = (hours * 3600) + (minutes * 60) + seconds; // количество прошедших секунд
            const remainingSeconds = totalSecondsInTimeMine - passedSeconds; // общее количество секунд - количество прошедших секунд

            coinsMinedSoFarRef.current = (coinsMine * remainingSeconds) / totalSecondsInTimeMine;
        }
    }, [coinsMine, timeMine, hours, minutes, seconds]);

    useEffect(() => {
        let isCoinsMineSet = false; // Флаг для отслеживания установки coinsMine

        if (coinsMine !== null && timeMine !== null) {
            const interval = setInterval(() => {
                const coinsPerSecond = (coinsMine / (timeMine * 3600)) / 2;

                if (!isCoinsMineSet && coinsMinedSoFarRef.current === coinsMine) {
                    // Установка coinsMine, если coinsMinedSoFarRef.current равен coinsMine
                    setValue(coinsMinedSoFarRef.current);
                    isCoinsMineSet = true; // Устанавливаем флаг в true, чтобы предотвратить повторную установку coinsMine
                }
                else {
                    coinsMinedSoFarRef.current += coinsPerSecond; // добавляем coinsPerSecond к coinsMinedSoFar
                    setValue(coinsMinedSoFarRef.current); // обновляем значение
                }

                if (coinsMine === coinsMinedSoFarRef.current) { // Проверяем, равны ли значения
                    setValue(coinsMine);
                    clearInterval(interval); // Останавливаем интервал
                }
            }, 500);

            return () => clearInterval(interval);
        }
    }, [coinsMine, timeMine]);

    useEffect(() => {
        generateNftDate();
    }, []);

    const generateNftDate = async () => {
        if (matterId && matterId < 2) {
            return;
        }

        if (nftDate) {
            return;
        }

        if (!currentTime)
        {
            return;
        }

        const endDate = new Date(currentTime);
        const startDate = new Date(currentTime);
        endDate.setDate(startDate.getDate() + 3);

        const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));

        setNftDate(randomDate);
    };

    return (
        <>
            <div className='watch-capsule'>
                <img src="/capsule_v_2.png" className='always-capsule' alt="Capsule" />
            </div>
            <div className='active-time'>
                <div className='current-coins'>
                    {value.toFixed(3)}
                </div>
                <div className='time-left'>
                    {timerFinished ? <span></span> : (hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`)}
                </div>
                <div className='info-for'>
                    {coinsMine}c/{timeMine}h
                </div>
                <div className='info-for position-top'>
                    {timerFinished && matterId !== null && value !== null && currentTime !== null && (
                        <ClaimButton telegramId={userData.id} matterId={matterId} coins={value} nftDate={nftDate} />
                    )}
                </div>
                <div className='info-for'>
                    {timerFinished ? <span></span> : <div className={`active-signal ${activeText === "Mined nft.." ? 'color-purple' : ''}`}>{activeText}</div>}
                </div>
            </div>
        </>
    );
};
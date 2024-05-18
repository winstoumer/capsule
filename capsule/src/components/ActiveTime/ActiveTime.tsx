import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ClaimButton from '../Buttons/ClaimButton';
import './activeTime.scss';

interface MiningData {
    matter_id: number;
    active: boolean;
    nft_active: boolean;
    coins_mine: number;
    time_mine: number;
    next_time: string;
    time_end_mined_nft: string;
}

export const ActiveTime = () => {
    const [reloadData, setReloadData] = useState(false);
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
    const [nftDate, setNftDate] = useState<Date | null>(null);
    const [nftEndDate, setNftEndDate] = useState<string | null>(null);

    useEffect(() => {
        try {
            if (window.Telegram && window.Telegram.WebApp) {
                setUserData(window.Telegram.WebApp.initDataUnsafe?.user);
            }
            setReloadData(false);
        } catch (error) {
            console.error('Error updating', error);
        }
    }, [reloadData]);

    useEffect(() => {
        try {
            if (userData && userData.id) {
                fetchCurrentTime().then(() => {
                    fetchMiningData(userData.id.toString());
                });
            }
            setReloadData(false);
        } catch (error) {
            console.error('Error updating', error);
        }
    }, [userData, reloadData]);

    function calculateTimeRemaining(currentTime: string, nftEndDate: string | null): string {
        if (nftEndDate) {
            const nowDate = new Date(currentTime);
            const endDate = new Date(nftEndDate);
            const timeDiff = endDate.getTime() - nowDate.getTime();
            const oneDay = 24 * 60 * 60 * 1000;
            const oneHour = 60 * 60 * 1000;

            if (timeDiff > oneDay) {
                const days = Math.floor(timeDiff / oneDay);
                return `~ ${days} days`;
            } else if (timeDiff > oneHour) {
                const hours = Math.floor(timeDiff / oneHour);
                return `~ ${hours} hours`;
            } else if (timeDiff > 0) {
                return `(~ soon)`;
            } else {
                return "";
            }
        }
        return "";
    }

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
            setNftEndDate(data.time_end_mined_nft);
            const remainingTime = calculateTimeRemaining(new Date(currentTime).toISOString(), nftEndDate);
            setActiveText(data.active ? `Active..` : (data.nft_active ? `Nft.. ${remainingTime}` : "Active.."));
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCurrentTime = async () => {
        try {
            const response = await axios.get('https://capsule-server.onrender.com/api/currentTime');
            const data = response.data;
            const currentTimeFormatted = data.currentTime.replace(' ', 'T');
            setCurrentTime(currentTimeFormatted);
        } catch (error) {
            console.error('Ошибка при получении текущего времени с сервера', error);
        }
    };

    useEffect(() => {
        try {
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
            setReloadData(false);

            return () => updateCountdown();
        } catch (error) {
            console.error('Error updating', error);
        }
    }, [nextTime, currentTime, reloadData]);

    useEffect(() => {
        try {
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

            setReloadData(false);

            return () => clearInterval(countdownInterval);
        } catch (error) {
            console.error('Error updating', error);
        }
    }, [hours, minutes, seconds, timerFinished, reloadData]);

    const coinsMinedSoFarRef = useRef<number>(0); // используем useRef для сохранения значения между вызовами useEffect

    useEffect(() => {
        try {
            if (coinsMine !== null && timeMine !== null) {
                const totalSecondsInTimeMine = timeMine * 3600; // общее количество секунд в timeMine
                const passedSeconds = (hours * 3600) + (minutes * 60) + seconds; // количество прошедших секунд
                const remainingSeconds = totalSecondsInTimeMine - passedSeconds; // общее количество секунд - количество прошедших секунд

                coinsMinedSoFarRef.current = (coinsMine * remainingSeconds) / totalSecondsInTimeMine;
            }

            setReloadData(false);
        } catch (error) {
            console.error('Error updating', error);
        }
    }, [coinsMine, timeMine, hours, minutes, seconds, reloadData]);

    useEffect(() => {
        try {
            let isCoinsMineSet = false;

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

                setReloadData(false);

                return () => clearInterval(interval);
            }
        } catch (error) {
            console.error('Error updating', error);
        }
    }, [coinsMine, timeMine, reloadData]);

    useEffect(() => {
        try {
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

            setReloadData(false);
            generateNftDate();
        } catch (error) {
            console.error('Error updating', error);
        }
    }, [matterId, nftDate, currentTime, reloadData]);

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
                    {timerFinished && hours <= 0 && minutes <= 0 && seconds <=0 ? 
                    <div>
                        {timerFinished && matterId !== null && value !== null && (
                            <ClaimButton telegramId={userData.id} matterId={matterId} coins={value} nftDate={nftDate} onClaim={() => setReloadData(true)} />
                        )}
                    </div> : <div className={`active-signal ${activeText === "Mined nft.." ? 'color-purple' : ''}`}>{activeText}</div>}
                </div>
            </div>
        </>
    );
};
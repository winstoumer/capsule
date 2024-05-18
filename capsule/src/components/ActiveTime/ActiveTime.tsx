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
                fetchMiningData(userData.id.toString());
            }
            fetchCurrentTime();
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

            if (isNaN(nowDate.getTime()) || isNaN(endDate.getTime())) {
                console.error('Invalid date');
                return '';
            }

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
            const remainingTime = calculateTimeRemaining(new Date(currentTime).toISOString(), data.time_end_mined_nft);
            setActiveText(data.active ? `Active.. ` : (data.nft_active ? `Mined nft.. ${remainingTime}` : ""));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        try {
            const interval = setInterval(() => {
                const remainingTime = calculateTimeRemaining(new Date(currentTime).toISOString(), nftEndDate);
                setActiveText(prevText => prevText === "Active.." ? `Mined nft.. ${remainingTime}` : "Active..");
            }, 2000);
            setReloadData(false);
            return () => clearInterval(interval);
        } catch (error) {
            console.error('Error updating', error);
        }
    }, [currentTime, nftEndDate, reloadData]);

    const fetchCurrentTime = async () => {
        try {
            const response = await axios.get('https://capsule-server.onrender.com/api/currentTime');
            const data = response.data;
            setCurrentTime(data.currentTime); // Directly use the ISO formatted string
        } catch (error) {
            console.error('Ошибка при получении текущего времени с сервера', error);
        }
    };

    useEffect(() => {
        try {
            const updateCountdown = () => {
                if (nextTime && currentTime) {
                    const currentNowTime = new Date(currentTime);
                    const currentNextTime = new Date(nextTime);
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

            setReloadData(false);

            return () => clearInterval(countdownInterval);
        } catch (error) {
            console.error('Error updating', error);
        }
    }, [hours, minutes, seconds, timerFinished, reloadData]);

    const coinsMinedSoFarRef = useRef<number>(0);

    useEffect(() => {
        try {
            if (coinsMine !== null && timeMine !== null) {
                const totalSecondsInTimeMine = timeMine * 3600;
                const passedSeconds = (hours * 3600) + (minutes * 60) + seconds;
                const coinsPerSecond = coinsMine / totalSecondsInTimeMine;
                let isCoinsMineSet = false;

                const interval = setInterval(() => {
                    if (coinsMinedSoFarRef.current === coinsMine) {
                        setValue(coinsMinedSoFarRef.current);
                        isCoinsMineSet = true;
                    } else {
                        coinsMinedSoFarRef.current += coinsPerSecond;
                        setValue(coinsMinedSoFarRef.current);
                    }

                    if (coinsMine === coinsMinedSoFarRef.current) {
                        setValue(coinsMine);
                        clearInterval(interval);
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
                    {timerFinished && currentTime !== null && matterId !== null && (
                        <ClaimButton telegramId={userData.id} matterId={matterId} coins={value} nftDate={nftDate} onClaim={() => setReloadData(true)} />
                    )}
                </div>
                <div className='info-for'>
                    {timerFinished ? <span></span> : <div className={`active-signal ${activeText === "Mined nft.." ? 'color-purple' : ''}`}>{activeText}</div>}
                </div>
            </div>
        </>
    );
};

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Loading } from '../Loading/Loading';
import { useUser } from '../UserProvider/UserContext';

interface DataContextType {
    loading: boolean;
    userData: TelegramUserData | null;
    balanceData: any;
    resetMineStates: () => void;
    fetchMiningData: (telegramUserId: string) => Promise<void>;
    level: number | null;
    nextTime: string | null;
    coinsMine: number | null;
    timeMine: number | null;
    matterId: number | null;
    nftEndDate: string | null;
    nftMined: boolean | null;
    mintActive: boolean | null;
    nftActive: boolean | null;
}

type TelegramUserData = {
    id: number;
    first_name: string;
};

type MiningData = {
    level: number;
    next_time: string;
    coins_mine: number;
    time_mine: number;
    matter_id: number;
    time_end_mined_nft: string;
    nft_mined: boolean;
    mint_active: boolean;
    nft_active: boolean;
};

const DataContext = createContext<DataContextType | null>(null);

interface DataProviderProps {
    children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
    const { userData } = useUser();

    const [balanceData, setBalance] = useState<any>(() => {
        const savedBalance = sessionStorage.getItem('balance');
        return savedBalance !== null ? parseFloat(savedBalance) : null;
    });
    const [loading, setLoading] = useState(true);

    const [level, setLevel] = useState<number | null>(() => {
        const savedLevel = sessionStorage.getItem('level');
        return savedLevel !== null ? parseInt(savedLevel, 10) : null;
    });
    const [nextTime, setNextTime] = useState<string | null>(() => sessionStorage.getItem('nextTime'));
    const [coinsMine, setCoinsMine] = useState<number | null>(() => {
        const savedCoinsMine = sessionStorage.getItem('coinsMine');
        return savedCoinsMine !== null ? parseFloat(savedCoinsMine) : null;
    });
    const [timeMine, setTimeMine] = useState<number | null>(() => {
        const savedTimeMine = sessionStorage.getItem('timeMine');
        return savedTimeMine !== null ? parseFloat(savedTimeMine) : null;
    });
    const [matterId, setMatterId] = useState<number | null>(() => {
        const savedMatterId = sessionStorage.getItem('matterId');
        return savedMatterId !== null ? parseInt(savedMatterId, 10) : null;
    });
    const [nftEndDate, setNftEndDate] = useState<string | null>(() => sessionStorage.getItem('nftEndDate'));
    const [nftMined, setNftMined] = useState<boolean | null>(() => {
        const savedNftMined = sessionStorage.getItem('nftMined');
        return savedNftMined !== null ? savedNftMined === savedNftMined : null;
    });
    const [mintActive, setMintActive] = useState<boolean | null>(() => {
        const savedMintActive = sessionStorage.getItem('mintActive');
        return savedMintActive !== null ? savedMintActive === savedMintActive : null;
    });
    const [nftActive, setNftActive] = useState<boolean | null>(() => {
        const savedNftActive = sessionStorage.getItem('nftActive');
        return savedNftActive !== null ? savedNftActive === savedNftActive : null;
    });

    useEffect(() => {
        if (userData && userData.id) {
            fetchUserData(userData.id.toString(), userData.first_name);
        }
    }, [userData]);

    useEffect(() => {
        if (balanceData !== null) {
            sessionStorage.setItem('balance', balanceData.toString());
        } else {
            sessionStorage.removeItem('balance');
        }
    }, [balanceData]);

    const fetchBalance = async (telegramUserId: string) => {
        try {
            const response = await axios.get(`https://capsule-server.onrender.com/api/balance/${telegramUserId}`);
            const responseData = response.data;
            if (responseData.hasOwnProperty('balance')) {
                const balanceValue = parseFloat(responseData.balance);
                if (!isNaN(balanceValue)) {
                    setBalance(balanceValue);
                } else {
                    throw new Error('Неверный формат баланса');
                }
            } else {
                throw new Error('Отсутствует поле "balance" в ответе сервера');
            }
        } catch (error) {
            console.error('Ошибка при загрузке баланса пользователя:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserData = async (telegramUserId: string, firstName: string) => {
        try {
            await axios.get(`https://capsule-server.onrender.com/api/user/${telegramUserId}`);
            fetchBalance(telegramUserId);
            fetchMiningData(telegramUserId);
        } catch (error) {
            console.error('Пользователь не найден:', error);
            try {
                await axios.post(`https://capsule-server.onrender.com/api/user/new/${telegramUserId}`, { first_name: firstName });
                fetchUserData(telegramUserId, firstName);
            } catch (createError) {
                console.error('Ошибка при создании пользователя:', createError);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchMiningData = async (telegramUserId: string) => {
        try {
            const response = await axios.get<MiningData>(`https://capsule-server.onrender.com/api/currentMining/current/${telegramUserId}`);
            const data = response.data;

            setLevel(data.level);
            setNextTime(data.next_time);
            setCoinsMine(data.coins_mine);
            setTimeMine(data.time_mine);
            setMatterId(data.matter_id);
            setNftEndDate(data.time_end_mined_nft);
            setNftMined(data.nft_mined);
            setMintActive(data.mint_active);
            setNftActive(data.nft_active);

            // Store mining data in session storage
            sessionStorage.setItem('level', data.level.toString());
            sessionStorage.setItem('nextTime', data.next_time);
            sessionStorage.setItem('coinsMine', data.coins_mine.toString());
            sessionStorage.setItem('timeMine', data.time_mine.toString());
            sessionStorage.setItem('matterId', data.matter_id.toString());
            sessionStorage.setItem('nftEndDate', data.time_end_mined_nft);
            sessionStorage.setItem('nftMined', data.nft_mined.toString());
            sessionStorage.setItem('mintActive', data.mint_active.toString());
        } catch (error) {
            console.error('Ошибка при загрузке данных о текущей активности', error);
        }
    };

    const resetMineStates = async () => {
        setBalance(null);
        sessionStorage.removeItem('balance');
        // Reset mining-related state variables
        setLevel(null);
        setNextTime(null);
        setCoinsMine(null);
        setTimeMine(null);
        setMatterId(null);
        setNftEndDate(null);
        setNftMined(null);
        setMintActive(null);
        setNftActive(null);
        sessionStorage.removeItem('level');
        sessionStorage.removeItem('nextTime');
        sessionStorage.removeItem('coinsMine');
        sessionStorage.removeItem('timeMine');
        sessionStorage.removeItem('matterId');
        sessionStorage.removeItem('nftEndDate');
        sessionStorage.removeItem('nftMined');
        sessionStorage.removeItem('mintActive');
        sessionStorage.removeItem('nftActive');

        if (userData && userData.id) {
            await fetchBalance(userData.id.toString());
            await fetchMiningData(userData.id.toString());
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <DataContext.Provider value={{
            balanceData,
            loading,
            userData,
            resetMineStates,
            fetchMiningData,
            level,
            nextTime,
            coinsMine,
            timeMine,
            matterId,
            nftEndDate,
            nftMined,
            mintActive,
            nftActive
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import Loading from '../Loading/Loading';
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
    imageUrl: string | null;
}

type TelegramUserData = {
    id: number;
    first_name: string;
};

type EncryptedMiningData = {
    level: string;
    next_time: string;
    coins_mine: string;
    time_mine: string;
    matter_id: string;
    time_end_mined_nft: string;
    nft_mined: string;
    mint_active: string;
    nft_active: string;
    image_url: string;
};

const DataContext = createContext<DataContextType | null>(null);

interface DataProviderProps {
    children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
    const { userData } = useUser();

    const apiUrl = import.meta.env.VITE_API_URL;
    const secretKey = import.meta.env.VITE_SECRET_KEY;

    const [balanceData, setBalance] = useState<any>(() => {
        const savedBalance = sessionStorage.getItem('balance');
        return savedBalance !== null ? parseFloat(savedBalance) : null;
    });
    const [loading, setLoading] = useState(true);

    const [level, setLevel] = useState<number | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [nextTime, setNextTime] = useState<string | null>(null);
    const [coinsMine, setCoinsMine] = useState<number | null>(null);
    const [timeMine, setTimeMine] = useState<number | null>(null);
    const [matterId, setMatterId] = useState<number | null>(null);
    const [nftEndDate, setNftEndDate] = useState<string | null>(null);
    const [nftMined, setNftMined] = useState<boolean | null>(false);
    const [mintActive, setMintActive] = useState<boolean | null>(false);
    const [nftActive, setNftActive] = useState<boolean | null>(false);

    useEffect(() => {
        if (userData && userData.id) {
            fetchUserData(userData.id.toString(), userData.first_name);
            fetchMiningData(userData.id.toString());
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
        const encryptedData = CryptoJS.AES.encrypt(telegramUserId, secretKey).toString();
        try {
            const response = await axios.get(`${apiUrl}/api/balance`, {
                params: { data: encryptedData },
            });
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
            await axios.get(`${apiUrl}/api/user/${telegramUserId}`);
            fetchBalance(telegramUserId);
        } catch (error) {
            console.error('Пользователь не найден:', error);
            try {
                await axios.post(`${apiUrl}/api/user/new/${telegramUserId}`,
                    { first_name: firstName });
                fetchUserData(telegramUserId, firstName);
            } catch (createError) {
                console.error('Ошибка при создании пользователя:', createError);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchMiningData = async (telegramUserId: string) => {
        const encryptedUserId = CryptoJS.AES.encrypt(telegramUserId, secretKey).toString();
        try {
            const response = await axios.get<EncryptedMiningData>(`${apiUrl}/api/currentMining/current`, {
                params: { data: encryptedUserId },
            });
            const encryptedData = response.data;

            const decryptedData = {
                level: Number(CryptoJS.AES.decrypt(encryptedData.level, secretKey).toString(CryptoJS.enc.Utf8)),
                image_url: CryptoJS.AES.decrypt(encryptedData.image_url, secretKey).toString(CryptoJS.enc.Utf8),
                next_time: CryptoJS.AES.decrypt(encryptedData.next_time, secretKey).toString(CryptoJS.enc.Utf8),
                coins_mine: Number(CryptoJS.AES.decrypt(encryptedData.coins_mine, secretKey).toString(CryptoJS.enc.Utf8)),
                time_mine: Number(CryptoJS.AES.decrypt(encryptedData.time_mine, secretKey).toString(CryptoJS.enc.Utf8)),
                matter_id: Number(CryptoJS.AES.decrypt(encryptedData.matter_id, secretKey).toString(CryptoJS.enc.Utf8)),
                time_end_mined_nft: encryptedData.time_end_mined_nft ? CryptoJS.AES.decrypt(encryptedData.time_end_mined_nft, secretKey).toString(CryptoJS.enc.Utf8) : null,
                nft_mined: CryptoJS.AES.decrypt(encryptedData.nft_mined, secretKey).toString(CryptoJS.enc.Utf8) === 'true',
                mint_active: CryptoJS.AES.decrypt(encryptedData.mint_active, secretKey).toString(CryptoJS.enc.Utf8) === 'true',
                nft_active: CryptoJS.AES.decrypt(encryptedData.nft_active, secretKey).toString(CryptoJS.enc.Utf8) === 'true',
            };

            setLevel(decryptedData.level);
            setImageUrl(decryptedData.image_url);
            setNextTime(decryptedData.next_time);
            setCoinsMine(decryptedData.coins_mine);
            setTimeMine(decryptedData.time_mine);
            setMatterId(decryptedData.matter_id);
            setNftEndDate(decryptedData.time_end_mined_nft);
            setNftMined(decryptedData.nft_mined);
            setMintActive(decryptedData.mint_active);
            setNftActive(decryptedData.nft_active);
        } catch (error) {
            console.error('Ошибка при загрузке данных о текущей активности', error);
        }
    };

    const resetMineStates = async () => {
        setBalance(null);
        sessionStorage.removeItem('balance');
        // Reset mining-related state variables
        setLevel(null);
        setImageUrl(null);
        setNextTime(null);
        setCoinsMine(null);
        setTimeMine(null);
        setMatterId(null);
        setNftEndDate(null);
        setNftMined(null);
        setMintActive(null);
        setNftActive(null);

        if (userData && userData.id) {
            sessionStorage.setItem('balance', balanceData.toString());
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
            imageUrl,
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

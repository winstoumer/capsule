import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Loading } from '../Loading/Loading';
import { useUser } from '../UserProvider/UserContext';

interface DataContextType {
    loading: boolean;
    userData: TelegramUserData | null;
    balanceData: any;
    resetBalanceStates: () => void;
}

type TelegramUserData = {
    id: number;
    first_name: string;
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
        } catch (error) {
            console.error('Пользователь не найден:', error);
            try {
                await axios.post(`https://capsule-server.onrender.com/api/user/new/${telegramUserId}`,
                { first_name: firstName });
                fetchUserData(telegramUserId, firstName);
            } catch (createError) {
                console.error('Ошибка при создании пользователя:', createError);
            }
        } finally {
            setLoading(false);
        }
    };

    const resetBalanceStates = async () => {
        setBalance(null);
        sessionStorage.removeItem('balance');

        if (userData && userData.id) {
            await fetchBalance(userData.id.toString());
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
            resetBalanceStates
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
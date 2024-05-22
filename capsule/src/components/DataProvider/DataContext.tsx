import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Loading } from '../Loading/Loading';

interface DataContextType {
    loading: boolean;
    userData: TelegramUserData | null;
    balanceData: any;
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
    const [balanceData, setBalance] = useState<any>(null);
    const [userData, setUserData] = useState<TelegramUserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [userExists, setUserExists] = useState(false);

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            const user = window.Telegram.WebApp.initDataUnsafe?.user;
            setUserData(user);
        }
    }, []);

    useEffect(() => {
        if (userData && userData.id) {
            fetchUserData(userData.id.toString(), userData.first_name);
        }
    }, [userData]);

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
            setUserExists(true);
            fetchBalance(telegramUserId); // Загрузка баланса пользователя после проверки наличия пользователя
        } catch (error) {
            console.error('Пользователь не найден:', error);
            try {
                await axios.post(`https://capsule-server.onrender.com/api/user/new/${telegramUserId}`, { first_name: firstName });
                fetchUserData(telegramUserId, firstName); // Повторный вызов для загрузки данных после создания пользователя
            } catch (createError) {
                console.error('Ошибка при создании пользователя:', createError);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
      }
    
      if (!userExists) {
        return <div></div>;
      }

    return (
        <DataContext.Provider value={{ balanceData, loading, userData }}>
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
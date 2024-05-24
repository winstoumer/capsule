import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import axios from 'axios';

interface CurrentTimeContextType {
    currentTime: string | null;
    fetchCurrentTime: () => void;
    resetTimeStates: () => void;
}

interface CurrentTimeProviderProps {
    children: ReactNode;
}

const CurrentTimeContext = createContext<CurrentTimeContextType | undefined>(undefined);

export const CurrentTimeProvider: React.FC<CurrentTimeProviderProps> = ({ children }) => {
    const [currentTime, setCurrentTime] = useState<string | null>(null);

    const fetchCurrentTime = useCallback(async () => {
        try {
            const response = await axios.get('https://capsule-server.onrender.com/api/currentTime');
            const currentTimeFormatted = response.data.currentTime.replace(' ', 'T');
            setCurrentTime(currentTimeFormatted);
        } catch (error) {
            console.error('Ошибка при получении текущего времени с сервера:', error);
        }
    }, []);

    useEffect(() => {
        fetchCurrentTime();
    }, [fetchCurrentTime]);

    const resetTimeStates = () => {
        setCurrentTime(null);
        fetchCurrentTime();
    };

    return (
        <CurrentTimeContext.Provider value={{ currentTime, fetchCurrentTime, resetTimeStates }}>
            {children}
        </CurrentTimeContext.Provider>
    );
};

export const useCurrentTime = () => {
    const context = useContext(CurrentTimeContext);
    if (!context) {
        throw new Error('useCurrentTime должен использоваться внутри CurrentTimeProvider');
    }
    return context;
};
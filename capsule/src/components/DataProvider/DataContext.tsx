import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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

    const [state, setState] = useState<DataContextType>({
        loading: true,
        userData: null,
        balanceData: null,
        resetMineStates: () => {},
        fetchMiningData: () => Promise.resolve(),
        level: null,
        nextTime: null,
        coinsMine: null,
        timeMine: null,
        matterId: null,
        nftEndDate: null,
        nftMined: null,
        mintActive: null,
        nftActive: null,
    });

    useEffect(() => {
        if (userData && userData.id) {
            fetchUserData(userData.id.toString(), userData.first_name);
        }
    }, [userData]);

    useEffect(() => {
        if (state.balanceData !== null) {
            sessionStorage.setItem('balance', state.balanceData.toString());
        } else {
            sessionStorage.removeItem('balance');
        }
    }, [state.balanceData]);

    const fetchBalance = async (telegramUserId: string) => {
        try {
            const response = await axios.get(`https://capsule-server.onrender.com/api/balance/${telegramUserId}`);
            const responseData = response.data;
            if (responseData.hasOwnProperty('balance')) {
                const balanceValue = parseFloat(responseData.balance);
                if (!isNaN(balanceValue)) {
                    setState(prevState => ({ ...prevState, balanceData: balanceValue }));
                } else {
                    throw new Error('Invalid balance format');
                }
            } else {
                throw new Error('Missing "balance" field in server response');
            }
        } catch (error) {
            console.error('Error fetching user balance:', error);
        } finally {
            setState(prevState => ({ ...prevState, loading: false }));
        }
    };

    const fetchUserData = async (telegramUserId: string, firstName: string) => {
        try {
            await axios.get(`https://capsule-server.onrender.com/api/user/${telegramUserId}`);
            fetchBalance(telegramUserId);
        } catch (error) {
            console.error('User not found:', error);
            try {
                await axios.post(`https://capsule-server.onrender.com/api/user/new/${telegramUserId}`, { first_name: firstName });
                fetchUserData(telegramUserId, firstName);
            } catch (createError) {
                console.error('Error creating user:', createError);
            }
        }
    };

    const fetchMiningData = useCallback(async (telegramUserId: string) => {
        try {
            const response = await axios.get<MiningData>(`https://capsule-server.onrender.com/api/currentMining/current/${telegramUserId}`);
            const data = response.data;
            setState(prevState => ({
                ...prevState,
                level: data.level,
                nextTime: data.next_time,
                coinsMine: data.coins_mine,
                timeMine: data.time_mine,
                matterId: data.matter_id,
                nftEndDate: data.time_end_mined_nft,
                nftMined: data.nft_mined,
                mintActive: data.mint_active,
                nftActive: data.nft_active,
            }));
        } catch (error) {
            console.error('Error fetching current mining data:', error);
        }
    }, []);

    const resetMineStates = useCallback(async () => {
        setState(prevState => ({
            ...prevState,
            balanceData: null,
            level: null,
            nextTime: null,
            coinsMine: null,
            timeMine: null,
            matterId: null,
            nftEndDate: null,
            nftMined: null,
            mintActive: null,
            nftActive: null,
        }));
        sessionStorage.clear();
        if (userData && userData.id) {
            await fetchBalance(userData.id.toString());
            await fetchMiningData(userData.id.toString());
        }
    }, [userData, fetchBalance, fetchMiningData]);

    if (state.loading) {
        return <Loading />;
    }

    return (
        <DataContext.Provider value={{
            ...state,
            resetMineStates,
            fetchMiningData,
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

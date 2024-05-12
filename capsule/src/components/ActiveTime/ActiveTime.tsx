import { useState, useEffect } from 'react';
import './activeTime.scss';
import { Loading } from '../Loading/Loading';

interface MiningData {
    active: boolean;
    nft_active: boolean;
    coins_mine: number;
    time_mine: number;
}

export const ActiveTime = () => {
    const [activeText, setActiveText] = useState("Active..");
    const [miningInfo, setMiningInfo] = useState<MiningData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMiningData = async () => {
            try {
                const response = await fetch('https://elaborate-gabriel-webapp-091be922.koyeb.app/api/currentMining/ready/987654321');
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке данных о текущей активности');
                }
                const data: MiningData = await response.json();
                setMiningInfo(data);
                setActiveText(data.active ? "Active.." : (data.nft_active ? "Mined nft.." : "Inactive"));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchMiningData();

        const interval = setInterval(() => {
            setActiveText(prevText => prevText === "Active.." ? "Mined nft.." : "Active..");
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div></div>;
    }

    return (
        <>
            <div className='watch-capsule'>
                <img src="/capsule_v_1.png" className='always-capsule' alt="Capsule" />
            </div>
            <div className='active-time'>
                <div className='time-left'>
                    1h 12m
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
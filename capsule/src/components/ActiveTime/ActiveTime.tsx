import './activeTime.scss';
import { useState, useEffect } from 'react';

export const ActiveTime = () => {
    const [activeText, setActiveText] = useState("Active..");

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveText(prevText => prevText === "Active.." ? "Mined nft.." : "Active..");
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className='active-time'>
            <div className='time-left'>
                1h 12m
            </div>
            <div className='info-for'>
                100/h
            </div>
            <div className={`active-signal ${activeText === "Mined nft.." ? 'color-purple' : ''}`}>
                {activeText}
            </div>
        </div>
    );
};

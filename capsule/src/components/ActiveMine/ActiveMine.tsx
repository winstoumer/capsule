import React, { useState, useEffect } from 'react';

interface TimeDisplayProps {
    currentTime: string;
    nftEndDate: string | null;
    nftActive: boolean;
}

function calculateTimeRemaining(currentTime: string, nftEndDate: string | null): string {
    if (nftEndDate) {
        const nowDate = new Date(currentTime);
        const endDate = new Date(nftEndDate);
        const timeDiff = endDate.getTime() - nowDate.getTime();
        const oneDay = 24 * 60 * 60 * 1000;
        const oneHour = 60 * 60 * 1000;

        if (timeDiff > oneDay) {
            const days = Math.floor(timeDiff / oneDay);
            return `Nft ~ ${days} days`;
        } else if (timeDiff > oneHour) {
            const hours = Math.floor(timeDiff / oneHour);
            return `Nft ~ ${hours} hours`;
        } else if (timeDiff > 0) {
            return `(Nft ~ soon)`;
        } else {
            return "";
        }
    }
    return "";
}

const ActiveMine: React.FC<TimeDisplayProps> = ({ currentTime, nftEndDate, nftActive }) => {
    const [remainingTime, setRemainingTime] = useState<string>('');
    const [showRemainingTime, setShowRemainingTime] = useState<boolean>(true);

    useEffect(() => {
        if (nftActive) {
            const interval = setInterval(() => {
                const newRemainingTime = calculateTimeRemaining(new Date(currentTime).toISOString(), nftEndDate);
                setRemainingTime(newRemainingTime);
                setShowRemainingTime(prev => !prev);
            }, 2000);

            return () => clearInterval(interval);
        }
    }, [currentTime, nftEndDate, nftActive]);

    return (
        <div>
            {nftActive && (!showRemainingTime ? <span className='color-purple'>{remainingTime}</span> : <span className='color-blue'>Active..</span>)}
        </div>
    );
};

export default ActiveMine;
import React from 'react';
import './earnInfo.scss';

interface EarnInfoProps {
    totalReward: number;
    icon: string;
}

const EarnInfo: React.FC<EarnInfoProps> = ({ totalReward, icon }) => {
    return (
        <div className='earn-info'>
            <div className='e-icon'>{icon}</div>
            <div className='e-total'>{totalReward}</div>
        </div>
    );
};

export default EarnInfo;

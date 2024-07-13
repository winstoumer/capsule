import './mining.scss';
import React from 'react';
import PageComponent from '../components/PageComponent/PageComponent';
import { ActiveTime } from "../components/ActiveTime/ActiveTime";
import StarryNightBackground from '../components/Background/StarryNightBackground';

const SvgMatter = () => (
    <svg width="280" height="280" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 280">
        <defs>
            <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{ stopColor: '#00CDFF', stopOpacity: 1 }} />
                <stop offset="70%" style={{ stopColor: 'transparent', stopOpacity: 0.5 }} />
                <stop offset="100%" style={{ stopColor: 'transparent', stopOpacity: 0 }} />
            </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="transparent" />
        <circle cx="140" cy="140" r="70" fill="black" />
        <circle cx="140" cy="80" r="70" fill="url(#glowGradient)">
            <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 140 140"
                to="360 140 140"
                dur="20s"
                repeatCount="indefinite"
            />
            <animate attributeName="opacity" dur="2s" values="1; 0.5; 1" repeatCount="indefinite" />
        </circle>
        <circle cx="140" cy="140" r="40" fill="black" />
    </svg>
);

const MiningPage: React.FC = () => {

    return (
        <PageComponent title='Mining'>
            <div className='general-mining'>
                <SvgMatter />
                <ActiveTime />
            </div>
            <StarryNightBackground maxStars={14} />
        </PageComponent>
    );
}

export default MiningPage;
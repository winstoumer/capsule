import './boost.scss';
import React, { useState } from 'react';

interface Level {
    id: number;
    name: string;
    coins: number;
    time: number;
    mines_nft: boolean;
}

export const Boost: React.FC = () => {
    const levels: Level[] = [
        { id: 1, name: 'LvL 1', coins: 100, time: 1, mines_nft: false },
        { id: 2, name: 'LvL 2', coins: 200, time: 4, mines_nft: true },
        { id: 3, name: 'LvL 3', coins: 300, time: 6, mines_nft: true }
    ];

    const [currentLevel, setCurrentLevel] = useState(levels[0]);
    const [animate, setAnimate] = useState(false);

    const handleUpgrade = () => {
        const currentIndex = levels.findIndex(level => level.id === currentLevel.id);
        if (currentIndex < levels.length - 1) {
            setCurrentLevel(levels[currentIndex + 1]);
            setAnimate(true);
            setTimeout(() => {
                setAnimate(false);
            }, 500);
        }
    };

    return (
        <div className='default-page evently-container'>
            <div className='balance'>
                {currentLevel.coins}
            </div>
            <div className={`boost-container ${animate ? 'boost-container-animate' : ''}`}>
                <div className='boost-item'>
                    <img src="capsule_v_2.png" className='boost-item-image' alt="Boost Item" />
                </div>
                <div className='boost-info'>
                    <div className='boost-name'>{currentLevel.name}</div>
                    <div className='boost-param'>{currentLevel.coins}/{currentLevel.time}h</div>
                    {currentLevel.mines_nft && (
                        <div className='boost-param'>
                            <span className='color-purple'>Mines NFT</span>
                        </div>
                    )}
                </div>
                <button className='default-button' onClick={handleUpgrade}>Upgrade</button>
            </div>
        </div>
    );
};
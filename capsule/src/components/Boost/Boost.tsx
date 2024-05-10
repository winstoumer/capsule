import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './boost.scss';

interface Level {
    id: number;
    name: string;
    coins: number;
    time: number;
    mines_nft: boolean;
    price: number;
}

export const Boost: React.FC = () => {
    const [balance, setBalance] = useState(1600); // Устанавливаем начальный баланс
    const levels: Level[] = [
        { id: 1, name: 'LvL 1', coins: 100, time: 1, mines_nft: false, price: 160 },
        { id: 2, name: 'LvL 2', coins: 200, time: 4, mines_nft: true, price: 340 },
        { id: 3, name: 'LvL 3', coins: 300, time: 6, mines_nft: true, price: 1020 }
    ];

    const [currentLevel, setCurrentLevel] = useState(levels[0]);
    const [animate, setAnimate] = useState(false);

    const handleUpgrade = () => {
        const currentIndex = levels.findIndex(level => level.id === currentLevel.id);
        if (currentIndex < levels.length - 1) {
            if (balance >= levels[currentIndex + 1].price) {
                setCurrentLevel(levels[currentIndex + 1]);
                setBalance(balance - levels[currentIndex + 1].price); // Обновляем баланс после покупки
                setAnimate(true);
                setTimeout(() => {
                    setAnimate(false);
                }, 500);
            } else {
                alert('Недостаточно средств для покупки!');
            }
        }
    };

    return (
        <div className='default-page evently-container'>
            <div className='balance'>
                {balance}
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
                <div className='price-item'>
                    <span className='color-blue'>{currentLevel.price}</span>
                </div>
                {balance >= currentLevel.price ? (
                    <button className='default-button' onClick={handleUpgrade}>Upgrade</button>
                ) : (
                    <Link to="/" className='default-button'>Mine</Link>
                )}
            </div>
        </div>
    );
};

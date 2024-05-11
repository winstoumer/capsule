import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './boost.scss';

interface User {
    user_id: number;
    balance: number;
    level: number;
}

interface Level {
    id: number;
    name: string;
    image: string;
    coins: number;
    time: number;
    mines_nft: boolean;
    price: number;
}

export const Boost: React.FC = () => {
    const [user, setUser] = useState<User>({ user_id: 1, balance: 1600, level: 1 });

    const levels: Level[] = [
        { id: 1, name: 'LvL 1', image: 'capsule_v_1.png', coins: 100, time: 1, mines_nft: false, price: 160 },
        { id: 2, name: 'LvL 2', image: 'capsule_v_2.png', coins: 200, time: 4, mines_nft: true, price: 340 },
        { id: 3, name: 'LvL 3', image: 'capsule_v_3.png', coins: 300, time: 6, mines_nft: true, price: 1020 },
        { id: 4, name: 'LvL 4', image: 'capsule_v_6.jpeg', coins: 600, time: 12, mines_nft: true, price: 4220 }
    ];

    const currentLevelIndex = levels.findIndex(level => level.id === user.level);
    const nextLevel = levels[currentLevelIndex + 1];

    const userLevel = levels[currentLevelIndex];

    const [animate, setAnimate] = useState(false);
    const [lastLevelAnimation, setLastLevelAnimation] = useState(false);

    const handleUpgrade = () => {
        if (nextLevel && user.balance >= nextLevel.price) {
            setUser({ ...user, level: nextLevel.id });
            if (nextLevel.id !== levels[levels.length - 1].id) {
                setAnimate(true);
                setTimeout(() => {
                    setAnimate(false);
                }, 500);
            }
        } else if (nextLevel && user.balance < nextLevel.price) {
            alert('Недостаточно средств для покупки!');
        } else {
            alert('Вы достигли максимального уровня!');
        }
    };

    useEffect(() => {
        if (!nextLevel) {
            setLastLevelAnimation(true);
        } else {
            setLastLevelAnimation(false);
        }
    }, [nextLevel]);

    return (
        <div className='default-page evently-container'>
            <div className='balance'>
                {user.balance}
            </div>
            <div className={`boost-container ${animate ? 'boost-container-animate' : ''}`}>
                {nextLevel ? (
                    <div className='boost-item'>
                        <img src={nextLevel.image} className='boost-item-image' alt="Boost Item" />
                    </div>
                ) : (
                    <div className='boost-item'>
                        <img src={userLevel.image} className='boost-item-image' alt="Boost Item" />
                    </div>
                )}
                <div className='boost-info'>
                    {nextLevel ? (
                        <div className='boost-name'>{nextLevel.name}</div>
                    ) : (
                        <div className='boost-name'>{userLevel.name}</div>
                    )}
                    {nextLevel ? (
                        <div className='boost-param'>{nextLevel.coins}/{nextLevel.time}h</div>
                    ) : (
                        <div className='boost-param'>{userLevel.coins}/{userLevel.time}h</div>
                    )}
                    {nextLevel && nextLevel.mines_nft ? (
                        <div className='boost-param'>
                            <span className='color-purple'>Mines NFT</span>
                        </div>
                    ) : (
                        <div className='boost-param'>
                            <span className='color-purple'>Mines NFT</span>
                        </div>
                    )}
                </div>
                <div className='price-item'>
                    {nextLevel ? (
                        <span className='color-blue'>{nextLevel.price}</span>
                    ) : null}
                </div>
                {nextLevel ? (
                    user.level < levels.length ? (
                        user.balance >= nextLevel.price ? (
                            <button className='default-button' onClick={handleUpgrade}>Upgrade</button>
                        ) : (
                            <Link to="/" className='default-button'>Mine</Link>
                        )
                    ) : null
                ) : (
                    <div className={`${lastLevelAnimation ? 'boost-last-level' : ''}`}></div>
                )}
            </div>
        </div>
    );
};
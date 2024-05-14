import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './boost.scss';

interface UserData {
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

    const [userData, setUserData] = useState<any>(null);
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            setUserData(window.Telegram.WebApp.initDataUnsafe?.user);
        }
    }, []);

    useEffect(() => {
        if (userData && userData.id) {
            fetchUserData(userData.id.toString());
        }
    }, [userData]);

    const fetchUserData = async (telegramUserId: string) => {
        try {
            const response = await fetch(`https://delicate-almira-webapp-b5aad7ad.koyeb.app/api/user/info/${telegramUserId}`);
            if (!response.ok) {
                throw new Error('Ошибка при загрузке данных пользователя');
            }
            const userData = await response.json();
            setUser(userData[0]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const levels: Level[] = [
        { id: 1, name: 'Level 1', image: 'capsule_v_1.png', coins: 100, time: 1, mines_nft: false, price: 160 },
        { id: 2, name: 'Level 2', image: 'capsule_v_2.png', coins: 200, time: 4, mines_nft: true, price: 340 },
        { id: 3, name: 'Level 3', image: 'capsule_v_3.png', coins: 300, time: 6, mines_nft: true, price: 1020 },
        { id: 4, name: 'Level 4', image: 'capsule_v_6.jpeg', coins: 600, time: 12, mines_nft: true, price: 4220 }
    ];

    const currentLevelIndex = user ? levels.findIndex(level => level.id === user.level) : -1;
    const nextLevel = currentLevelIndex !== -1 ? levels[currentLevelIndex + 1] : null;
    const userLevel = currentLevelIndex !== -1 ? levels[currentLevelIndex] : null;

    const [animate, setAnimate] = useState(false);
    const [lastLevelAnimation, setLastLevelAnimation] = useState(false);

    const handleUpgrade = async () => {
        if (nextLevel && user && user.balance >= nextLevel.price) {
            try {
                await updateLevel(nextLevel.id);
                setUser({ ...user, level: nextLevel.id });
                if (nextLevel.id !== levels[levels.length - 1].id) {
                    setAnimate(true);
                    setTimeout(() => {
                        setAnimate(false);
                    }, 500);
                }
            } catch (error) {
                console.error('Ошибка при обновлении уровня пользователя:', error);
                alert('Произошла ошибка при обновлении уровня пользователя');
            }
        } else if (nextLevel && user && user.balance < nextLevel.price) {
            alert('Недостаточно средств для покупки!');
        } else {
            alert('Вы достигли максимального уровня!');
        }
    };

    const updateLevel = async (nextLevelId: number) => {
        try {
            const response = await fetch(`https://delicate-almira-webapp-b5aad7ad.koyeb.app/api/matter/upgrade/${userData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ matter_id: nextLevelId }),
            });
            if (!response.ok) {
                console.log(response)
                throw new Error('Ошибка при обновлении уровня пользователя');
            }
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        if (!nextLevel) {
            setLastLevelAnimation(true);
        } else {
            setLastLevelAnimation(false);
        }
    }, [nextLevel]);

    if (loading) {
        return <div></div>;
    }

    if (!user) {
        return <div>Данные о пользователе не найдены.</div>;
    }

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
                        <img src={userLevel!.image} className='boost-item-image' alt="Boost Item" />
                    </div>
                )}
                <div className='boost-info'>
                    {nextLevel ? (
                        <div className='boost-name'>{nextLevel.name}</div>
                    ) : (
                        <div className='boost-name'>{userLevel!.name}</div>
                    )}
                    {nextLevel ? (
                        <div className='boost-param'>{nextLevel.coins}/{nextLevel.time}h</div>
                    ) : (
                        <div className='boost-param'>{userLevel!.coins}/{userLevel!.time}h</div>
                    )}
                    {nextLevel && nextLevel.mines_nft ? (
                        <div className='boost-param'>
                            <span className='color-purple'>NFT</span>
                        </div>
                    ) : (
                        <div className='boost-param'>
                            <span className='color-purple'>NFT</span>
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

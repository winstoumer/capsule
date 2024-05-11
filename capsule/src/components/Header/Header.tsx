import React, { useEffect, useState } from 'react';
import './header.scss';

type TelegramUserData = {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
};

export const Header: React.FC = () => {
    const [userData, setUserData] = useState<TelegramUserData | null>(null);

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            setUserData(window.Telegram.WebApp.initDataUnsafe?.user);
        }
    }, []);

    return <header>
        <div className='header-width'>
            <div className="header-b">
                {userData && userData.first_name ? (
                    <>
                        {userData.first_name}
                    </>
                ) : (
                    <></>
                )}
            </div>
            <div className="header-b">
                <button className='connect-wallet-button'>Connect wallet</button>
            </div>
        </div>
    </header>
};
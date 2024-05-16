import React, { useEffect, useState } from 'react';
import { TonConnectButton } from "@tonconnect/ui-react";
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
                {userData ? (
                    <>{userData.first_name}</>
                ) : (
                    <span></span>
                )}
            </div>
            <div className="header-b">
                <TonConnectButton className='connect-wallet-button' />
            </div>
        </div>
    </header>
};
import React, { useEffect, useState } from 'react';
import { TonConnectButton, useTonWallet, useTonConnectUI } from "@tonconnect/ui-react";
import './header.scss';

type TelegramUserData = {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
};

export const Header: React.FC = () => {
    const [userData, setUserData] = useState<TelegramUserData | null>(null);

    const wallet = useTonWallet();

    const [tonConnectUi] = useTonConnectUI();

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            setUserData(window.Telegram.WebApp.initDataUnsafe?.user);
        }
    }, []);

    return (
        <header>
            <div className='header-width'>
                <div className="first-name">
                    {userData ? (
                        <>{userData.first_name}</>
                    ) : (
                        <span></span>
                    )}
                </div>
                <div>
                    <React.Fragment>
                        {wallet ? (
                            <TonConnectButton />
                        ) : (
                            <button className="default-button" onClick={() => tonConnectUi.openModal()}>
                                Connect wallet
                            </button>
                        )}
                    </React.Fragment>
                </div>
            </div>
        </header>
    );
};
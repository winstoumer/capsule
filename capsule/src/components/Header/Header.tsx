import React, { useEffect, useState } from 'react';
import { useTonAddress, useTonWallet, useTonConnectUI } from "@tonconnect/ui-react";
import './header.scss';
import Button from '../Default/Button';

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

    const userFriendlyAddress = useTonAddress();
    const rawAddress = useTonAddress(false);

    const AddressComponent = () => {
        return (
            userFriendlyAddress && (
                <div className='my-address'>
                    <span>{userFriendlyAddress}</span>
                    <span>{rawAddress}</span>
                </div>
            )
        );
    }

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
                            <AddressComponent />
                        ) : (
                            <Button text='Connect wallet' custom={true} onClick={() => tonConnectUi.openModal()} />
                        )}
                    </React.Fragment>
                </div>
            </div>
        </header>
    );
};
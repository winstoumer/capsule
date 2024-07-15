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

    const ArrowDown = () => {
        return (
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M5 9L12 16L19 9"
                    stroke="#CF00F8"
                    strokeWidth="0.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    };

    const AddressComponent = () => {

        const firstFour = userFriendlyAddress.slice(0, 5);
        const lastFour = userFriendlyAddress.slice(-4);

        const combinedAddress = `${firstFour}...${lastFour}`;

        return (
            userFriendlyAddress && (
                <div className='my-address'>
                    <span>{combinedAddress}</span>
                    <span>
                        <ArrowDown />
                    </span>
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
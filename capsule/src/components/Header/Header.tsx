import React, { useEffect, useState } from 'react';
import { useTonAddress, useTonWallet, useTonConnectUI } from "@tonconnect/ui-react";
import './header.scss';
import Button from '../Default/Button';
import Modal from './Modal';

type TelegramUserData = {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
};

export const Header: React.FC = () => {
    const [userData, setUserData] = useState<TelegramUserData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const wallet = useTonWallet();
    const [tonConnectUi] = useTonConnectUI();
    const userFriendlyAddress = useTonAddress();

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            setUserData(window.Telegram.WebApp.initDataUnsafe?.user);
        }
    }, []);

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
                    stroke="white"
                    strokeWidth="0.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    };

    const Copy = () => {
        return (
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect x="4" y="4" width="14" height="14" rx="4" fill="transparent" stroke="white" stroke-width="0.5" />
                <rect x="6" y="6" width="14" height="14" rx="4" fill="white" stroke="white" stroke-width="0.5" />
            </svg>
        );
    };

    const Disconnect = () => {
        return (
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect x="4" y="4" width="14" height="16" rx="4" fill="transparent" stroke="white" stroke-width="0.5" />
                <path d="M20 12L12 12M12 12L16 8M12 12L16 16" stroke="white" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        );
    }

    const handleAddressClick = () => {
        setIsModalOpen(true);
    };

    const AddressComponent = () => {
        const firstFour = userFriendlyAddress.slice(0, 4);
        const lastFour = userFriendlyAddress.slice(-4);
        const combinedAddress = `${firstFour}...${lastFour}`;

        return (
            userFriendlyAddress && (
                <div className='my-address' onClick={handleAddressClick}>
                    <span>{combinedAddress}</span>
                    <ArrowDown />
                </div>
            )
        );
    }

    const handleDisconnect = async () => {
        await tonConnectUi.disconnect();
        setIsModalOpen(false);
    };

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
                            <div className='modal-open'>
                                <AddressComponent />
                            </div>
                        ) : (
                            <Button text='Connect wallet' custom={true} onClick={() => tonConnectUi.openModal()} />
                        )}
                    </React.Fragment>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className='list-modal'>
                    <div className='item-modal'>
                        <Copy />
                        <div className=''>Copy address</div>
                    </div>
                    <div className='item-modal'>
                        <Disconnect />
                        <div className='' onClick={handleDisconnect}>Disconnect</div>
                    </div>
                </div>
            </Modal>
        </header>
    );
};

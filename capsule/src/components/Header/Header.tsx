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
    const [copyStatus, setCopyStatus] = useState('Copy address');

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

    const handleAddressClick = () => {
        setIsModalOpen(true);
    };

    const handleCopyAddress = () => {
        if (userFriendlyAddress) {
            navigator.clipboard.writeText(userFriendlyAddress)
                .then(() => {
                    setCopyStatus('Copied.');
                    setTimeout(() => {
                        setCopyStatus('Copy address');
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy address: ', err);
                    // Можно добавить здесь обратную связь или уведомление об ошибке
                });
        }
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
                <div className="header-profile">
                    {userData ? (
                        <>
                            <span className='name'>{userData.first_name}</span>
                            <span className='username'>{userData.username}</span>
                        </>
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
                            <Button icon='connect' iconSize={20} text='Connect' custom={true} onClick={() => tonConnectUi.openModal()} />
                        )}
                    </React.Fragment>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className='list-modal'>
                    <div className='item-modal'>
                        <div className='copy' onClick={handleCopyAddress}>{copyStatus}</div>
                    </div>
                    <div className='item-modal'>
                        <div className='disconnect' onClick={handleDisconnect}>Disconnect</div>
                    </div>
                </div>
            </Modal>
        </header>
    );
};

import React, { useEffect, useState, useRef } from 'react';
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
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0, right: 0 });
    const addressRef = useRef<HTMLDivElement>(null);

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
        if (addressRef.current) {
            const rect = addressRef.current.getBoundingClientRect();
            setModalPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, right: rect.right + window.scrollX });
        }
        setIsModalOpen(true);
    };

    const AddressComponent = () => {
        const firstFour = userFriendlyAddress.slice(0, 5);
        const lastFour = userFriendlyAddress.slice(-4);
        const combinedAddress = `${firstFour}...${lastFour}`;

        return (
            userFriendlyAddress && (
                <div className='my-address' onClick={handleAddressClick} ref={addressRef}>
                    <span>{combinedAddress}</span>
                    <ArrowDown />
                </div>
            )
        );
    }

    const handleDisconnect = async () => {
        await tonConnectUi.disconnect();
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
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} position={modalPosition}>
                <div className='list-modal'>
                    <div className=''>
                        <div className=''>
                        </div>
                        <div className=''>Copy address</div>
                    </div>
                    <div className=''>
                        <div className=''>
                        </div>
                        <div className='' onClick={handleDisconnect}>Disconnect</div>
                    </div>
                </div>
            </Modal>
        </header>
    );
};

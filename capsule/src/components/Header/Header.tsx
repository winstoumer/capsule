import React, { useEffect, useState } from 'react';
import { TonConnectButton, TonConnectUI, THEME } from "@tonconnect/ui-react";
import './header.scss';

type TelegramUserData = {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
};

export const Header: React.FC = () => {
    const [userData, setUserData] = useState<TelegramUserData | null>(null);

    const tonConnectUI = new TonConnectUI({
        manifestUrl: 'https://<YOUR_APP_URL>/tonconnect-manifest.json',
        uiPreferences: {
            colorsSet: {
                [THEME.DARK]: {
                    connectButton: {
                        background: '#ffffff'
                    }
                }
            }
        }
    });

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            setUserData(window.Telegram.WebApp.initDataUnsafe?.user);
            tonConnectUI.uiOptions = {
                uiPreferences: {
                    theme: THEME.DARK,
                    borderRadius: 's',
                    colorsSet: {
                        [THEME.DARK]: {
                            connectButton: {
                                background: '#ffffff'
                            }
                        },
                        [THEME.LIGHT]: {
                            text: {
                                primary: '#FF0000'
                            }
                        }
                    }
                }
            };
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
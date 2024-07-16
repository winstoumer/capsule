import { useState, useEffect } from 'react';
import axios from 'axios';
import './referral.scss';
import Button from '../Default/Button';
import Loading from '../Loading/Loading';

export const Referral = () => {
    const [userData, setUserData] = useState<any>(null);
    const [invitedCount, setInvitedCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            setUserData(window.Telegram.WebApp.initDataUnsafe?.user);
        }
    }, []);

    useEffect(() => {
        if (userData && userData.id) {
            fetchInvitedCount(userData.id.toString());
        }
    }, [userData]);

    const fetchInvitedCount = async (telegramUserId: string) => {
        try {
            const response = await fetch(`${apiUrl}/api/referral/${telegramUserId}`);
            if (!response.ok) {
                throw new Error('Error');
            }
            const data = await response.json();
            setInvitedCount(data.invitedCount);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    const handleReferralLinkClick = async () => {
        try {
            await axios.post(`${apiUrl}/api/bot/sendReferralMessage`, { telegramUserId: userData.id });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className='referral-container'>
                <div className='task-completion-container'>
                    <div className='task-completion-count'>
                        Frens:
                        <span className='completed-count'>{invitedCount || 0}</span>
                    </div>
                    <div className='task-completion-count'>
                        <Button text='Get link' onClick={handleReferralLinkClick} />
                    </div>
                </div>
            </div>
            <div className='referral-info'>
                <svg width="140" height="140" viewBox="0 0 100 100">
                    <circle id="moon" cx="50" cy="50" r="30" fill="#000000" />
                    <circle cx="50" cy="50" r="30" fill="url(#purpleGlow)">
                        <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="10s" repeatCount="indefinite" />
                    </circle>
                    <defs>
                        <radialGradient id="purpleGlow" cx="70%" cy="10%" r="70%" fx="70%" fy="10%">
                            <stop offset="0%" style={{ stopColor: '#210622', stopOpacity: 1 }}>
                                <animate attributeName="stop-opacity" values="1;0.5;1" dur="3s" repeatCount="indefinite" />
                            </stop>
                            <stop offset="100%" style={{ stopColor: '#012027', stopOpacity: 1 }} />
                        </radialGradient>
                        <radialGradient id="meteorGlow1" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" style={{ stopColor: '#00E4FF', stopOpacity: 1 }}>
                                <animate attributeName="stop-opacity" values="1;0.5;1" dur="3s" repeatCount="indefinite" />
                            </stop>
                            <stop offset="100%" style={{ stopColor: '#00000000', stopOpacity: 1 }} />
                        </radialGradient>
                        <radialGradient id="meteorGlow2" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" style={{ stopColor: '#00E4FF', stopOpacity: 1 }}>
                                <animate attributeName="stop-opacity" values="1;0.5;1" dur="3s" repeatCount="indefinite" />
                            </stop>
                            <stop offset="100%" style={{ stopColor: '#00000000', stopOpacity: 1 }} />
                        </radialGradient>
                        <radialGradient id="meteorGlow3" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" style={{ stopColor: '#7400FF', stopOpacity: 1 }}>
                                <animate attributeName="stop-opacity" values="1;0.5;1" dur="3s" repeatCount="indefinite" />
                            </stop>
                            <stop offset="100%" style={{ stopColor: '#00000000', stopOpacity: 1 }} />
                        </radialGradient>
                        <radialGradient id="meteorGlow4" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" style={{ stopColor: '#1E90FF', stopOpacity: 1 }}>
                                <animate attributeName="stop-opacity" values="1;0.5;1" dur="3s" repeatCount="indefinite" />
                            </stop>
                            <stop offset="100%" style={{ stopColor: '#00000000', stopOpacity: 1 }} />
                        </radialGradient>
                        <radialGradient id="meteorGlow5" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" style={{ stopColor: '#ADFF2F', stopOpacity: 1 }}>
                                <animate attributeName="stop-opacity" values="1;0.2;1" dur="3s" repeatCount="indefinite" />
                            </stop>
                            <stop offset="100%" style={{ stopColor: '#00000000', stopOpacity: 1 }} />
                        </radialGradient>
                    </defs>
                    <circle cx="80" cy="50" r="13" fill="url(#meteorGlow1)">
                        <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="6s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="70" cy="50" r="4" fill="url(#meteorGlow2)">
                        <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="90" cy="50" r="10" fill="url(#meteorGlow3)">
                        <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="8s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="60" cy="50" r="4" fill="url(#meteorGlow4)">
                        <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="75" cy="50" r="20" fill="url(#meteorGlow5)">
                        <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="7s" repeatCount="indefinite" />
                    </circle>
                </svg>
                <div className='referral-text'>
                    For each invitee you receive 50 P.
                </div>
                <div className=''>
                    <Button text='Copy invitation link' custom={true} onClick={handleReferralLinkClick} />
                </div>
            </div>
        </>
    );
};

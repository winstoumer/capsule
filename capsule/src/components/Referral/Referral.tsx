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
    );
};

import { useState, useEffect } from 'react';
import './referral.scss';

export const Referral = () => {
    const [userData, setUserData] = useState<any>(null);
    const [invitedCount, setInvitedCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

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
                const response = await fetch(`https://elaborate-gabriel-webapp-091be922.koyeb.app/api/referral/${telegramUserId}`);
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке данных о приглашенных пользователях');
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
        return <div></div>;
    }

    return (
        <div className='referral-container'>
            <div className='invited-count'>Invited {invitedCount || 0}</div>
            <div className='referral-watch'>
                <img src="/invite.jpg" className='referral-image' alt="Invite Image" />
            </div>
            <button className='default-button'>Referral link</button>
        </div>
    );
};

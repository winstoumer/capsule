import { useState, useEffect } from 'react';
import './referral.scss';

export const Referral = () => {
    const [invitedCount, setInvitedCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvitedCount = async () => {
            try {
                const response = await fetch('https://elaborate-gabriel-webapp-091be922.koyeb.app/api/referral/987654321');
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

        fetchInvitedCount();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
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

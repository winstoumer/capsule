import React, { useEffect, useState } from 'react';
import { List, Item, Icon, Title, Subtitle, Right } from '../List/List';
import './leaderboard.scss';
import NumericValue from '../Default/NumericValue';

interface Reward {
    type: string;
    value: string;
}

interface Leader {
    telegram_id: number;
    first_name: string;
    points: number;
    event_id: number;
    place?: number;
    reward?: Reward[]; // Обновлено для массива наград
}

export const LeaderBoard: React.FC = () => {
    const [leaders, setLeaders] = useState<Leader[]>([]);
    const apiUrl = import.meta.env.VITE_API_URL;
    const eventId = 1; // Пример, замените на актуальный идентификатор события

    useEffect(() => {
        const fetchLeaders = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/leaderboard/leaderboard?eventId=${eventId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch leaders');
                }
                const data: Leader[] = await response.json();
                setLeaders(data);
            } catch (error) {
                console.error('Error fetching leaders:', error);
            }
        };

        fetchLeaders();
    }, [eventId]);

    const getMedal = (place: number) => {
        if (place === 1) return <span className="medal gold">1</span>;
        if (place === 2) return <span className="medal silver">2</span>;
        if (place === 3) return <span className="medal bronze">3</span>;
        return <span>{place}</span>;
    };

    // Функция для получения награды в формате строки
    const formatRewards = (rewards: Reward[]) => {
        if (!rewards) return 'No rewards';

        const coinsReward = rewards.find(reward => reward.type === 'coins');
        const additionalRewards = rewards.filter(reward => reward.type !== 'coins');

        return (
            <>
                {coinsReward && (
                    <span className='coins-reward'>
                        +<NumericValue value={coinsReward.value} />
                    </span>
                )}
                {additionalRewards.length > 0 && (
                    <span className='additional-reward'>
                        {additionalRewards.map((reward, index) => (
                            <span key={index}>{reward.value}</span>
                        ))}
                    </span>
                )}
            </>
        );
    };

    return (
        <List>
            {leaders.map((leader) => (
                <Item key={leader.telegram_id}>
                    <Icon>{getMedal(leader.place || 0)}</Icon>
                    <div className='item-wrapper'>
                        <div className='item-center-container'>
                            <Title>{leader.first_name}</Title>
                            <Subtitle>
                                {formatRewards(leader.reward || [])}
                            </Subtitle>
                        </div>
                        <Right>{leader.points}</Right>
                    </div>
                </Item>
            ))}
        </List>
    );
};
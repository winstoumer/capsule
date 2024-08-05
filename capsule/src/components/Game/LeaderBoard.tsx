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
    reward?: Reward[];
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

    return (
        <List>
            {leaders.map((leader) => (
                <Item key={leader.telegram_id}>
                    <Icon>{getMedal(leader.place || 0)}</Icon>
                    <div className='item-wrapper'>
                        <div className='item-center-container'>
                            <Title>{leader.first_name}</Title>
                            <Subtitle>
                                <span>
                                    +<NumericValue value={leader.points.toString()} />
                                </span>
                                {leader.reward?.map((r, index) => (
                                    <span key={index} className='additional-reward'>
                                        {r.value}
                                    </span>
                                ))}
                            </Subtitle>
                        </div>
                        <Right>{leader.points}</Right>
                    </div>
                </Item>
            ))}
        </List>
    );
};
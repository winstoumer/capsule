import React, { useEffect, useState } from 'react';
import { List, Item, Icon, Title, Subtitle, Right } from '../List/List';
import './leaderboard.scss';
import NumericValue from '../Default/NumericValue';

interface Reward {
    type: string;
    value: string;
}

interface Leader {
    place: number;
    name: string;
    points: number;
    rewards: Reward[];
}

export const LeaderBoard: React.FC = () => {
    const [leaders, setLeaders] = useState<Leader[]>([]);

    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        // Fetch the current leaders from the API
        const fetchLeaders = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/leaderboard/current-leaders`);
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
    }, []);

    const getMedal = (place: number) => {
        if (place === 1) return <span>1</span>;
        if (place === 2) return <span>2</span>;
        if (place === 3) return <span>3</span>;
        return place;
    };

    return (
        <List>
            {leaders.map((leader) => (
                <Item key={leader.place}>
                    <Icon>{getMedal(leader.place) || leader.place}</Icon>
                    <div className='item-wrapper'>
                        <div className='item-center-container'>
                            <Title>{leader.name}</Title>
                            <Subtitle>
                                <span>+<NumericValue value={leader.rewards[0].value.toString()} /></span>
                                {leader.rewards.slice(1).map((reward, index) => (
                                    <span key={index} className='additional-reward'>
                                        {reward.value}
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

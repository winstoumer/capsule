import React from 'react';
import List from '../List/List';
import './leaderboard.scss';

interface Leader {
    place: number;
    name: string;
    reward: string;
    points: number;
}

const leaders: Leader[] = [
    { place: 1, name: 'Alice', reward: '+5000 P', points: 1500 },
    { place: 2, name: 'Bob', reward: '+4000 P', points: 1400 },
    { place: 3, name: 'Charlie', reward: '+3000 P', points: 1300 },
    { place: 4, name: 'David', reward: '+1000 P', points: 1200 },
    { place: 5, name: 'Eve', reward: '+1000 P', points: 1100 },
    { place: 6, name: 'Frank', reward: '+1000 P', points: 1000 },
    { place: 7, name: 'Grace', reward: '+1000 P', points: 900 },
    { place: 8, name: 'Hank', reward: '+1000 P', points: 800 },
    { place: 9, name: 'Ivy', reward: '+1000 P', points: 700 },
    { place: 10, name: 'Jack', reward: '+1000 P', points: 600 },
];

export const LeaderBoard: React.FC = () => {
    const getMedal = (place: number) => {
        if (place === 1) return '🥇';
        if (place === 2) return '🥈';
        if (place === 3) return '🥉';
        return '';
    };

    const getX2 = (place: number) => {
        if (place === 1 || place === 2 || place === 3) {
            return (
                <>
                    <span className='reward-x2'>X2</span>
                </>
            );
        }
    };

    return (
        <List>
            {leaders.map((leader) => (
                <div className='list-item' key={leader.place}>
                    <div className='item-container-icon'>
                        {getMedal(leader.place) || leader.place}
                    </div>
                    <div className='item-content'>
                        <div className='leaderboard-info'>
                            <div className='leaderboard-name'>
                                {leader.name}
                            </div>
                            <div className='leaderboard-reward'>
                                {leader.reward}
                                {getX2(leader.place)}
                            </div>
                        </div>
                        <div className='leaderboard-points'>
                            {leader.points}
                        </div>
                    </div>
                </div>
            ))}
        </List>
    );
};

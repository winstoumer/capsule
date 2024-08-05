import React from 'react';
import { List, Item, Icon, Title, Subtitle, Right } from '../List/List';
import './leaderboard.scss';
import NumericValue from 'components/Default/NumericValue';

interface Leader {
    place: number;
    name: string;
    reward: string;
    points: number;
}

const leaders: Leader[] = [
    { place: 1, name: 'Alice', reward: '300000', points: 1500 },
    { place: 2, name: 'Bob', reward: '200000', points: 1400 },
    { place: 3, name: 'Charlie', reward: '100000', points: 1300 },
    { place: 4, name: 'David', reward: '50000', points: 1200 },
    { place: 5, name: 'Eve', reward: '10000', points: 1100 },
    { place: 6, name: 'Frank', reward: '10000', points: 1000 },
    { place: 7, name: 'Grace', reward: '10000', points: 900 },
    { place: 8, name: 'Hank', reward: '10000', points: 800 },
    { place: 9, name: 'Ivy', reward: '10000', points: 700 },
    { place: 10, name: 'Jack', reward: '10000', points: 600 },
];

export const LeaderBoard: React.FC = () => {
    const getMedal = (place: number) => {
        if (place === 1) return <span>1</span>;
        if (place === 2) return <span>2</span>;
        if (place === 3) return <span>3</span>;
        return place;
    };

    const getAdditionalRewards = (place: number) => {
        switch (place) {
            case 1:
                return (
                    <>
                        <span className='additional-reward'>X2</span>
                        <span className='additional-reward'>30TON</span>
                    </>
                );
            case 2:
                return (
                    <>
                        <span className='additional-reward'>X2</span>
                        <span className='additional-reward'>20TON</span>
                    </>
                );
            case 3:
                return (
                    <>
                        <span className='additional-reward'>X2</span>
                        <span className='additional-reward'>10TON</span>
                    </>
                );
            default:
                return null;
        }
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
                                +<NumericValue value={leader.reward} />
                                {getAdditionalRewards(leader.place)}
                            </Subtitle>
                        </div>
                        <Right>{leader.points}</Right>
                    </div>
                </Item>
            ))}
        </List>
    );
};

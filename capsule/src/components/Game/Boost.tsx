import ListItems from '../ListItems/ListItems';
import './boost.scss';
import React from 'react';

interface LevelInfo {
  level: number | string;
  value: number;
  price: number;
}

const allLevels: { [key: string]: LevelInfo[] } = {
    Time: [
        { level: 1, value: 5, price: 10 },
        { level: 2, value: 10, price: 20 },
        { level: 3, value: 15, price: 30 }
    ],
    Multitap: [
        { level: 1, value: 1, price: 10 },
        { level: 2, value: 2, price: 20 },
        { level: 3, value: 3, price: 30 },
        { level: 4, value: 4, price: 40 },
        { level: 5, value: 5, price: 50 },
        { level: 6, value: 6, price: 60 }
    ],
    Coins: [
        { level: 1, value: 0.1, price: 10 },
        { level: 2, value: 0.2, price: 20 },
        { level: 3, value: 0.3, price: 30 },
        { level: 4, value: 0.4, price: 40 },
        { level: 5, value: 0.5, price: 50 }
    ]
};

const userLevels: { [key: string]: number | string } = {
    Time: 1,
    Multitap: 2,
    Coins: 1
};

const getNextLevel = (currentLevel: number, levels: LevelInfo[]) => {
    const currentIndex = levels.findIndex(levelInfo => levelInfo.level === currentLevel);
    return currentIndex !== -1 && currentIndex < levels.length - 1
        ? levels[currentIndex + 1]
        : null;
};

const items = [
    {
        icon: '',
        name: 'Time',
        price: getNextLevel(userLevels.Time as number, allLevels.Time)?.price,
        mark: getNextLevel(userLevels.Time as number, allLevels.Time)?.level,
        i: 'lvl'
    },
    {
        icon: '',
        name: 'Multitap',
        price: getNextLevel(userLevels.Multitap as number, allLevels.Multitap)?.price,
        mark: getNextLevel(userLevels.Multitap as number, allLevels.Multitap)?.level,
        i: 'lvl'
    },
    {
        icon: '💵',
        name: 'Coins',
        price: getNextLevel(userLevels.Coins as number, allLevels.Coins)?.price,
        mark: getNextLevel(userLevels.Coins as number, allLevels.Coins)?.level,
        i: 'lvl'
    }
];

const Boost: React.FC = () => {
    return (
        <ListItems items={items} />
    );
}

export default Boost;

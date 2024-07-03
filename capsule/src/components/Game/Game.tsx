import React, { useState } from 'react';
import './App.css';

const Game: React.FC = () => {
    const [coins, setCoins] = useState<number>(0);

    const handleButtonClick = () => {
        setCoins(coins + 1);
    };

    return (
        <div className="game">
            <div className='coins'>Coins: {coins}</div>
            <button className='button-game' onClick={handleButtonClick}>
                <svg width="230" height="230" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="115" cy="115" r="110" stroke="white" stroke-width="1" fill="none" />
                </svg>
            </button>
        </div>
    );
};

export default Game;

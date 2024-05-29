// Loading.tsx
import React from 'react';
import './loading.scss';

const generateDiamonds = (numDiamonds: number) => {
    return Array.from({ length: numDiamonds }, (_, i) => {
        const randomX = Math.random();
        const randomY = Math.random();
        return (
            <span
                key={i}
                className="diamond"
                style={{ '--randomX': randomX, '--randomY': randomY } as React.CSSProperties}
            >
                💎
            </span>
        );
    });
};

export const Loading: React.FC = () => {
    return (
        <div className="loading-container">
            {generateDiamonds(10)}
            <div className="loading-center"></div>
        </div>
    );
};

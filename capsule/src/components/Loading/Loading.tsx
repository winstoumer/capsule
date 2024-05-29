// Loading.tsx
import React, { useEffect, useState } from 'react';
import './loading.scss';

interface Diamond {
    id: number;
    top: number;
    left: number;
}

const Loading: React.FC = () => {
    const [diamonds, setDiamonds] = useState<Diamond[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDiamonds(prevDiamonds => {
                const newDiamond: Diamond = {
                    id: Date.now(),
                    top: Math.random() * 100,
                    left: Math.random() * 100
                };
                return [...prevDiamonds, newDiamond];
            });
        }, 100); // Interval for adding new diamonds (milliseconds)

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loading-container">
            {diamonds.map(diamond => (
                <span
                    key={diamond.id}
                    className="diamond"
                    style={{ top: `${diamond.top}vh`, left: `${diamond.left}vw` }}
                >
                    🖕
                </span>
            ))}
            <div className="loading-center"></div>
        </div>
    );
};

export default Loading;

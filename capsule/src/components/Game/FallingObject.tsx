import React, { useEffect, useState } from 'react';
import './fallingObject.scss'

interface FallingObjectProps {
    onCatch: () => void;
    position: { top: number; left: number };
    onEnd: () => void;
}

const FallingObject: React.FC<FallingObjectProps> = ({ onCatch, position, onEnd }) => {
    const [top, setTop] = useState(position.top);

    useEffect(() => {
        const fallInterval = setInterval(() => {
            setTop(prevTop => {
                const newTop = prevTop + 1;
                if (newTop >= 100) {
                    clearInterval(fallInterval);
                    onEnd(); // Notify parent that this object has fallen
                    return newTop; // Ensure the position is at the bottom
                }
                return newTop;
            });
        }, 50);

        return () => clearInterval(fallInterval);
    }, [onEnd]);

    const handleClick = () => {
        onCatch();
        setTop(100); // Move object out of view when caught
    };

    return (
        <div
            className="falling-object"
            style={{ top: `${top}%`, left: `${position.left}%` }}
            onClick={handleClick}
        >
            +10
        </div>
    );
};

export default FallingObject;

import React, { useState, useEffect } from 'react';
import './fallingObject.scss';

interface FallingObjectProps {
    onCatch: () => void;
}

const FallingObject: React.FC<FallingObjectProps> = ({ onCatch }) => {
    const [position, setPosition] = useState({ top: 0, left: Math.random() * 100 });
    const [isCaught, setIsCaught] = useState(false);

    useEffect(() => {
        const fallInterval = setInterval(() => {
            setPosition((prev) => {
                const newTop = prev.top + 1;
                if (newTop >= 100) {
                    clearInterval(fallInterval);
                }
                return { ...prev, top: newTop };
            });
        }, 50);

        return () => clearInterval(fallInterval);
    }, []);

    const handleClick = () => {
        setIsCaught(true);
        onCatch();
    };

    if (isCaught) return null;

    return (
        <div
            className="falling-object"
            style={{ top: `${position.top}%`, left: `${position.left}%` }}
            onClick={handleClick}
        >
            +10
        </div>
    );
};

export default FallingObject;

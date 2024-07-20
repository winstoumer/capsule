import React, { useState, useEffect } from 'react';
import './fallingObject.scss';

interface FallingObjectProps {
    onCatch: () => void;
    position: { top: number; left: number };
    falling: boolean;
}

const FallingObject: React.FC<FallingObjectProps> = ({ onCatch, position, falling }) => {
    const [isCaught, setIsCaught] = useState(false);

    const handleCatch = () => {
        if (!isCaught) {
            setIsCaught(true);
            onCatch();
        }
    };

    useEffect(() => {
        if (isCaught) {
            // Запускаем падение вниз через 200ms после уменьшения
            const fallTimeout = setTimeout(() => {
                setIsCaught(false);
            }, 200);

            return () => clearTimeout(fallTimeout);
        }
    }, [isCaught]);

    if (!falling && !isCaught) return null;

    return (
        <div
            className={`falling-object ${isCaught ? 'caught' : ''}`}
            style={{ top: `${position.top}%`, left: `${position.left}%` }}
            onClick={handleCatch}
            onTouchStart={handleCatch}
        >
            +10
        </div>
    );
};

export default FallingObject;

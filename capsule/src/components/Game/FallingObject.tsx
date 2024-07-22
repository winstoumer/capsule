import React, { useState, useEffect, memo } from 'react';
import './fallingObject.scss';

interface FallingObjectProps {
    onCatch: () => void;
    position: { top: number; left: number };
    falling: boolean;
}

const FallingObject: React.FC<FallingObjectProps> = memo(({ onCatch, position, falling }) => {
    const [isCaught, setIsCaught] = useState(false);

    const handleCatch = () => {
        if (!isCaught) {
            setIsCaught(true);
            onCatch();
        }
    };

    useEffect(() => {
        if (isCaught) {
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
            +50
        </div>
    );
});

export default FallingObject;


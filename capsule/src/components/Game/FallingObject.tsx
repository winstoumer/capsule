import React, { useState, useEffect, memo } from 'react';
import './fallingObject.scss';

interface FallingObjectProps {
    onCatch: () => void;
    position: { top: number; left: number };
    falling: boolean;
}

const FloatingNumber: React.FC<{ position: { top: number; left: number } }> = ({ position }) => {
    return (
        <div
            className="floating-number"
            style={{ top: `${position.top}%`, left: `${position.left}%` }}
        >
            +50
        </div>
    );
};

const FallingObject: React.FC<FallingObjectProps> = memo(({ onCatch, position, falling }) => {
    const [isCaught, setIsCaught] = useState(false);
    const [showFloatingNumber, setShowFloatingNumber] = useState(false);

    const handleCatch = () => {
        if (!isCaught) {
            setIsCaught(true);
            setShowFloatingNumber(true);
            onCatch();
            setTimeout(() => setShowFloatingNumber(false), 1000);
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
            {showFloatingNumber && <FloatingNumber position={position} />}
        </div>
    );
});

export default FallingObject;



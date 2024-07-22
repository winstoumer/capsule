import React, { useState, useEffect, memo } from 'react';
import './fallingObject.scss';

interface FallingObjectProps {
    onCatch: () => void;
    position: { top: number; left: number };
    falling: boolean;
}

const FloatingNumber: React.FC<{ position: { x: number; y: number } }> = ({ position }) => {
    return (
        <div
            className="floating-number"
            style={{ top: `${position.y}px`, left: `${position.x}px` }}
        >
            +50
        </div>
    );
};

const FallingObject: React.FC<FallingObjectProps> = memo(({ onCatch, position, falling }) => {
    const [isCaught, setIsCaught] = useState(false);
    const [showFloatingNumber, setShowFloatingNumber] = useState(false);
    const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);

    const handleCatch = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isCaught) {
            setIsCaught(true);
            setShowFloatingNumber(true);
            const { clientX, clientY } = 'touches' in e ? e.touches[0] : e;
            setClickPosition({ x: clientX, y: clientY });
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
            {showFloatingNumber && clickPosition && (
                <FloatingNumber position={clickPosition} />
            )}
        </div>
    );
});

export default FallingObject;

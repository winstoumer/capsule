import React, { useState, useEffect, memo, useCallback } from 'react';
import FloatingNumber from './FloatingNumber';

interface FallingObjectProps {
    onCatch: () => void;
    position: { top: number; left: number };
    falling: boolean;
    caught: boolean;
    bonusPoints?: number; // Added bonusPoints prop
}

const FallingObject: React.FC<FallingObjectProps> = memo(({ onCatch, position, falling, caught, bonusPoints }) => {
    const [isCaught, setIsCaught] = useState(false);
    const [floatingNumbers, setFloatingNumbers] = useState<{ x: number; y: number; points: number }[]>([]);

    const handleCatch = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isCaught && !caught) {
            setIsCaught(true);
            onCatch();

            const clickX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
            const clickY = 'clientY' in e ? e.clientY : e.touches[0].clientY;

            console.log(`Handling catch at (${clickX}, ${clickY}), bonusPoints: ${bonusPoints}`); // Debug

            setFloatingNumbers([...floatingNumbers, { x: clickX, y: clickY, points: bonusPoints || 0 }]);
        }
    }, [isCaught, onCatch, floatingNumbers, caught, bonusPoints]);

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
        <>
            <div
                className={`falling-object ${caught ? 'caught' : ''}`}
                style={{ top: `${position.top}%`, left: `${position.left}%` }}
                onMouseDown={handleCatch}
                onTouchStart={handleCatch}
            >
                50
            </div>
            {floatingNumbers.map((num, index) => (
                <FloatingNumber key={index} position={{ x: num.x, y: num.y }} points={num.points} />
            ))}
        </>
    );
});

export default FallingObject;

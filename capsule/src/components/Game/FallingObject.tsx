// FallingObject.tsx
import React, { useState, useEffect, memo, useCallback } from 'react';
import FloatingNumber from './FloatingNumber';

interface FallingObjectProps {
    onCatch: () => void;
    position: { top: number; left: number };
    falling: boolean;
    caught: boolean;
    bonusPoints?: number; // Bonus points should be optional
}

const FallingObject: React.FC<FallingObjectProps> = memo(({ onCatch, position, falling, caught, bonusPoints = 0 }) => {
    const [isCaught, setIsCaught] = useState(false);
    const [floatingNumbers, setFloatingNumbers] = useState<{ top: number; left: number; points: number }[]>([]);

    const handleCatch = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isCaught && !caught) {
            setIsCaught(true);
            onCatch();

            const clickX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
            const clickY = 'clientY' in e ? e.clientY : e.touches[0].clientY;

            setFloatingNumbers([...floatingNumbers, { top: clickY, left: clickX, points: bonusPoints }]);
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
                <FloatingNumber key={index} position={{ top: num.top, left: num.left }} points={num.points} />
            ))}
        </>
    );
});

export default FallingObject;

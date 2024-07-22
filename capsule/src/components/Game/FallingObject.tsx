import React, { useState, useEffect, memo, useCallback } from 'react';
import FloatingNumber from './FloatingNumber';

interface FallingObjectProps {
    onCatch: () => void;
    position: { top: number; left: number };
    falling: boolean;
}

const FallingObject: React.FC<FallingObjectProps> = memo(({ onCatch, position, falling }) => {
    const [isCaught, setIsCaught] = useState(false);
    const [floatingNumbers, setFloatingNumbers] = useState<{ x: number; y: number }[]>([]);

    const handleCatch = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isCaught) {
            setIsCaught(true);
            onCatch();

            const clickX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
            const clickY = 'clientY' in e ? e.clientY : e.touches[0].clientY;

            setFloatingNumbers([...floatingNumbers, { x: clickX, y: clickY }]);
        }
    }, [isCaught, onCatch, floatingNumbers]);

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
                className={`falling-object ${isCaught ? 'caught' : ''}`}
                style={{ top: `${position.top}%`, left: `${position.left}%` }}
                onMouseDown={handleCatch}
                onTouchStart={handleCatch}
            >
                +50
            </div>
            {floatingNumbers.map((position, index) => (
                <FloatingNumber key={index} position={position} />
            ))}
        </>
    );
});

export default FallingObject;


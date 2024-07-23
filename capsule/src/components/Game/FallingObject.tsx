import React, { useState, useEffect, memo, useCallback } from 'react';
import FloatingNumber from './FloatingNumber';

interface FallingObjectProps {
    onCatch: (score: number) => void;
    position: { top: number; left: number };
    falling: boolean;
    caught: boolean;
    fallStartTime: number; // Added this prop to pass the start time
}

const FallingObject: React.FC<FallingObjectProps> = memo(({ onCatch, position, falling, caught, fallStartTime }) => {
    const [isCaught, setIsCaught] = useState(false);
    const [floatingNumbers, setFloatingNumbers] = useState<{ x: number; y: number; score: number }[]>([]);

    const handleCatch = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isCaught && !caught) {
            setIsCaught(true);

            const currentTime = performance.now();
            const fallDuration = (currentTime - fallStartTime) / 1000; // duration in seconds

            let additionalScore = 0;
            if (fallDuration <= 1) {
                additionalScore = 10;
            } else if (fallDuration <= 2) {
                additionalScore = 6;
            } else if (fallDuration <= 3) {
                additionalScore = 3;
            }

            const totalScore = 50 + additionalScore;
            onCatch(totalScore);

            const clickX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
            const clickY = 'clientY' in e ? e.clientY : e.touches[0].clientY;

            setFloatingNumbers([...floatingNumbers, { x: clickX, y: clickY, score: totalScore }]);
        }
    }, [isCaught, onCatch, floatingNumbers, caught, fallStartTime]);

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
                +50
            </div>
            {floatingNumbers.map((floatingNumber, index) => (
                <FloatingNumber key={index} position={{ x: floatingNumber.x, y: floatingNumber.y }} score={floatingNumber.score} />
            ))}
        </>
    );
});

export default FallingObject;

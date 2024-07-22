import React, { useState, useEffect, memo, useCallback } from 'react';
import './fallingObject.scss';

interface FallingObjectProps {
    onCatch: () => void;
    position: { top: number; left: number };
    falling: boolean;
}

interface FloatingNumberProps {
    position: { x: number; y: number };
}

const FloatingNumber: React.FC<FloatingNumberProps> = ({ position }) => (
    <div className="floating-number-bonus" style={{ top: `${position.y}px`, left: `${position.x}px` }}>
        +50
    </div>
);

const FallingObject: React.FC<FallingObjectProps> = memo(({ onCatch, position, falling }) => {
    const [isCaught, setIsCaught] = useState(false);
    const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumberProps[]>([]);

    const handleCatch = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isCaught) {
            setIsCaught(true);
            onCatch();

            const clickX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
            const clickY = 'clientY' in e ? e.clientY : e.touches[0].clientY;

            setFloatingNumbers((prev) => [
                ...prev,
                { position: { x: clickX, y: clickY } }
            ]);

            setTimeout(() => {
                setFloatingNumbers((prev) => prev.slice(1));
            }, 1000);
        }
    }, [isCaught, onCatch]);

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
            />
            {floatingNumbers.map((fn, index) => (
                <FloatingNumber key={index} position={fn.position} />
            ))}
        </>
    );
});

export default FallingObject;

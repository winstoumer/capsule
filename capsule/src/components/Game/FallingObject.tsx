import React, { useState, useEffect, memo, useCallback } from 'react';
import './fallingObject.scss';

interface FallingObjectProps {
    onCatch: () => void;
    position: { top: number; left: number };
    falling: boolean;
}

interface FloatingNumberProps {
    id: number;
    x: number;
    y: number;
}

const FloatingNumber: React.FC<FloatingNumberProps> = ({ x, y }) => (
    <div className="floating-number" style={{ top: y, left: x }}>
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

            const newFloatingNumber: FloatingNumberProps = { id: Date.now(), x: clickX, y: clickY };
            setFloatingNumbers((prev) => [...prev, newFloatingNumber]);

            setTimeout(() => {
                setFloatingNumbers((prev) => prev.filter(fn => fn.id !== newFloatingNumber.id));
            }, 1000); // Remove the floating number after 1 second
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
            {floatingNumbers.map((fn) => (
                <FloatingNumber key={fn.id} id={fn.id} x={fn.x} y={fn.y} />
            ))}
        </>
    );
});

export default FallingObject;

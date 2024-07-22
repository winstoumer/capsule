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
    <div className="floating-number-bonus" style={{ top: y, left: x }}>
        +50
    </div>
);

const FallingObject: React.FC<FallingObjectProps> = memo(({ onCatch, position, falling }) => {
    const [isCaught, setIsCaught] = useState(false);
    const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumberProps[]>([]);
    const [shouldRemove, setShouldRemove] = useState(false);

    const handleCatch = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isCaught) {
            setIsCaught(true);
            onCatch();

            const clickX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
            const clickY = 'clientY' in e ? e.clientY : e.touches[0].clientY;

            const newFloatingNumber: FloatingNumberProps = { id: Date.now(), x: clickX, y: clickY };
            setFloatingNumbers(prev => [...prev, newFloatingNumber]);

            // Mark the object for removal after the floating number animation
            setTimeout(() => {
                setShouldRemove(true);
            }, 3000); // Match this time with the floating number animation duration
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

    useEffect(() => {
        if (shouldRemove) {
            // Clean up floating numbers after their animation
            const cleanupTimeout = setTimeout(() => {
                setFloatingNumbers(prev => prev.filter(fn => !fn.id));
            }, 3000); // Match this time with the floating number animation duration

            return () => clearTimeout(cleanupTimeout);
        }
    }, [shouldRemove]);

    if (!falling && !isCaught && !shouldRemove) return null;

    return (
        <>
            {!shouldRemove && (
                <div
                    className={`falling-object ${isCaught ? 'caught' : ''}`}
                    style={{ top: `${position.top}%`, left: `${position.left}%` }}
                    onMouseDown={handleCatch}
                    onTouchStart={handleCatch}
                >
                    +50
                </div>
            )}
            {floatingNumbers.map(fn => (
                <FloatingNumber key={fn.id} id={fn.id} x={fn.x} y={fn.y} />
            ))}
        </>
    );
});

export default FallingObject;

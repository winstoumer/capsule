import React, { useState, useEffect, memo, useCallback } from 'react';
import FloatingNumber from './FloatingNumber';
import './fallingObject.scss';

interface FallingObjectProps {
    onCatch: () => void;
    position: { top: number; left: number };
    falling: boolean;
}

const FallingObject: React.FC<FallingObjectProps> = memo(({ onCatch, position, falling }) => {
    const [isCaught, setIsCaught] = useState(false);
    const [floatingNumbers, setFloatingNumbers] = useState<{ id: number; position: { x: number; y: number } }[]>([]);

    const handleCatch = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isCaught) {
            setIsCaught(true);
            onCatch();

            const clickX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
            const clickY = 'clientY' in e ? e.clientY : e.touches[0].clientY;

            setFloatingNumbers((prev) => [
                ...prev,
                { id: Date.now(), position: { x: clickX, y: clickY } }
            ]);
        }
    }, [isCaught, onCatch]);

    const removeFloatingNumber = useCallback((id: number) => {
        setFloatingNumbers((prev) => prev.filter(fn => fn.id !== id));
    }, []);

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
            >+50</div>
            {floatingNumbers.map((fn) => (
                <FloatingNumber key={fn.id} position={fn.position} onRemove={() => removeFloatingNumber(fn.id)} />
            ))}
        </>
    );
});

export default FallingObject;


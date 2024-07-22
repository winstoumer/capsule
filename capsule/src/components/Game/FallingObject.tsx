import React, { useState, useEffect, useCallback } from 'react';
import FloatingNumber from './FloatingNumber';
import './fallingObject.scss';

interface FallingObjectProps {
    onCatch: () => void;
    position: { top: number; left: number };
    falling: boolean;
}

const FallingObject: React.FC<FallingObjectProps> = ({ onCatch, position, falling }) => {
    const [isCaught, setIsCaught] = useState(false);
    const [floatingNumbers, setFloatingNumbers] = useState<{ id: number; x: number; y: number }[]>([]);
    
    const handleCatch = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isCaught) {
            setIsCaught(true);
            onCatch();
            
            const clickX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
            const clickY = 'clientY' in e ? e.clientY : e.touches[0].clientY;

            const newFloatingNumber = { id: Date.now(), x: clickX, y: clickY };
            setFloatingNumbers(prev => [...prev, newFloatingNumber]);

            // Remove floating number after animation
            setTimeout(() => {
                setFloatingNumbers(prev => prev.filter(fn => fn.id !== newFloatingNumber.id));
            }, 3000); // Match this with CSS animation duration
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

    return (
        <>
            {!falling && !isCaught ? null : (
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
                <FloatingNumber
                    key={fn.id}
                    id={fn.id}
                    x={fn.x}
                    y={fn.y}
                    onAnimationEnd={() => {
                        // Floating number animation end handler
                        setFloatingNumbers(prev => prev.filter(fnItem => fnItem.id !== fn.id));
                    }}
                />
            ))}
        </>
    );
};

export default FallingObject;

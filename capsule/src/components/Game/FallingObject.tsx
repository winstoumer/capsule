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
    onAnimationEnd: () => void;
}

const FloatingNumber: React.FC<FloatingNumberProps> = ({ id, x, y, onAnimationEnd }) => {
    useEffect(() => {
        // Clean up when animation ends
        const element = document.querySelector(`.floating-number-bonus[data-id='${id}']`);
        const handleAnimationEnd = () => {
            onAnimationEnd();
        };

        element?.addEventListener('animationend', handleAnimationEnd);

        return () => {
            element?.removeEventListener('animationend', handleAnimationEnd);
        };
    }, [id, onAnimationEnd]);

    return (
        <div
            className="floating-number-bonus"
            style={{ top: y, left: x }}
            data-id={id} // Use data attribute to identify this element
        >
            +50
        </div>
    );
};

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

            const newFloatingNumber: FloatingNumberProps = { id: Date.now(), x: clickX, y: clickY, onAnimationEnd: () => {} };
            setFloatingNumbers(prev => [...prev, newFloatingNumber]);

            // Mark the object for removal after the floating number animation
            setTimeout(() => {
                setShouldRemove(true);
            }, 3000); // Ensure this matches the duration of the floating number animation
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
            // Clean up floating numbers when they have finished animating
            const cleanupTimeout = setTimeout(() => {
                setFloatingNumbers([]);
            }, 3000); // Ensure this matches the duration of the floating number animation

            return () => clearTimeout(cleanupTimeout);
        }
    }, [shouldRemove]);

    const handleFloatingNumberAnimationEnd = (id: number) => {
        setFloatingNumbers(prev => prev.filter(fn => fn.id !== id));
    };

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
                <FloatingNumber
                    key={fn.id}
                    id={fn.id}
                    x={fn.x}
                    y={fn.y}
                    onAnimationEnd={() => handleFloatingNumberAnimationEnd(fn.id)}
                />
            ))}
        </>
    );
});

export default FallingObject;

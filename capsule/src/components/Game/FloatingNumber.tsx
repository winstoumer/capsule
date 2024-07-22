import React, { useEffect, useRef } from 'react';
import './floatingNumber.scss';

interface FloatingNumberProps {
    id: number; // Still keep `id` for internal use in `onAnimationEnd`
    x: number;
    y: number;
    onAnimationEnd: () => void;
}

const FloatingNumber: React.FC<FloatingNumberProps> = ({ x, y, onAnimationEnd }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (element) {
            const handleAnimationEnd = () => {
                onAnimationEnd();
            };

            element.addEventListener('animationend', handleAnimationEnd);

            return () => {
                element.removeEventListener('animationend', handleAnimationEnd);
            };
        }
    }, [onAnimationEnd]);

    return (
        <div
            className="floating-number-bonus"
            style={{ top: y, left: x, position: 'absolute' }} // Ensure it's absolutely positioned
            ref={ref}
        >
            +50
        </div>
    );
};

export default FloatingNumber;
import React, { useEffect, useState } from 'react';
import './fallingObject.scss';

interface FloatingNumberProps {
    position: { x: number; y: number };
    points: number; // Accept points as a prop
}

const FloatingNumber: React.FC<FloatingNumberProps> = ({ position, points }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    console.log(`FloatingNumber at (${position.x}, ${position.y}), points: ${points}`); // Debug

    return (
        <div className="floating-number-bonus" style={{ top: `${position.y}px`, left: `${position.x}px` }}>
            {points}
        </div>
    );
};

export default FloatingNumber;
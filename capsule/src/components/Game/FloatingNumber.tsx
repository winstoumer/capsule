import React, { useEffect, useState } from 'react';
import './fallingObject.scss';

interface FloatingNumberProps {
    position: { x: number; y: number };
    score: number; // Added this prop to pass the score
}

const FloatingNumber: React.FC<FloatingNumberProps> = ({ position, score }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="floating-number-bonus" style={{ top: `${position.y}px`, left: `${position.x}px` }}>
            {score}
        </div>
    );
};

export default FloatingNumber;

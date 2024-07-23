// FloatingNumber.tsx
import React, { useEffect, useState } from 'react';
import './fallingObject.scss';

interface FloatingNumberProps {
    position: { top: number; left: number };
    points: number; // Ensure points are used
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

    return (
        <div className="floating-number-bonus" style={{ top: `${position.top}px`, left: `${position.left}px` }}>
            +{points} {/* Display the points */}
        </div>
    );
};

export default FloatingNumber;

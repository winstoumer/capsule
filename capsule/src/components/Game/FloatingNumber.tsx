import React, { useEffect, useState } from 'react';
import './fallingObject.scss';

interface FloatingNumberProps {
    position: { x: number; y: number };
}

const FloatingNumber: React.FC<FloatingNumberProps> = ({ position }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000); // Remove the floating number after 3 seconds

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="floating-number-bonus" style={{ top: `${position.y}px`, left: `${position.x}px` }}>
            +50
        </div>
    );
};

export default FloatingNumber;
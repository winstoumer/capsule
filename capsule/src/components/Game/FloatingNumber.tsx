import React, { useEffect } from 'react';
import './fallingObject.scss';

interface FloatingNumberProps {
    position: { x: number; y: number };
    onRemove: () => void;
}

const FloatingNumber: React.FC<FloatingNumberProps> = ({ position, onRemove }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove();
        }, 3000); // Убираем элемент через 3 секунды

        return () => clearTimeout(timer);
    }, [onRemove]);

    return (
        <div className="floating-number" style={{ top: `${position.y}px`, left: `${position.x}px` }}>
            +50
        </div>
    );
};

export default React.memo(FloatingNumber);

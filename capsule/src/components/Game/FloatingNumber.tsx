import React, { useEffect } from 'react';
import './floatingNumber.scss'; // Добавьте свой файл стилей, если еще не добавлен

interface FloatingNumberProps {
    id: number;
    x: number;
    y: number;
    onAnimationEnd: () => void;
}

const FloatingNumber: React.FC<FloatingNumberProps> = ({ id, x, y, onAnimationEnd }) => {
    useEffect(() => {
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
            data-id={id}
        >
            +50
        </div>
    );
};

export default FloatingNumber;

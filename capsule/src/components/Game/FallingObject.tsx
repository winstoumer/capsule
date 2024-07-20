import React, { useEffect, useState } from 'react';
import './fallingObject.scss'; // Импорт стилей

interface FallingObjectProps {
    onCatch: () => void;
    position: { top: number; left: number };
    onEnd: () => void;
}

const FallingObject: React.FC<FallingObjectProps> = ({ onCatch, position, onEnd }) => {
    const [top, setTop] = useState(position.top);
    const [isCaught, setIsCaught] = useState(false);

    useEffect(() => {
        const fallInterval = setInterval(() => {
            setTop(prevTop => {
                const newTop = prevTop + 1;
                if (newTop >= 100) { // Когда объект достигнет нижней границы контейнера
                    clearInterval(fallInterval);
                    setIsCaught(true);
                    onEnd();
                }
                return newTop;
            });
        }, 50);

        return () => clearInterval(fallInterval);
    }, [onEnd]);

    const handleClick = () => {
        if (!isCaught) {
            setIsCaught(true);
            onCatch();
        }
    };

    if (isCaught) return null;

    return (
        <div
            className="falling-object"
            style={{ top: `${top}%`, left: `${position.left}%` }}
            onClick={handleClick}
        >
            +10
        </div>
    );
};

export default FallingObject;

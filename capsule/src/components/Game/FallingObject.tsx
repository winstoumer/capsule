import { useState } from 'react';
import './fallingObject.scss'; // Импорт стилей

interface FallingObjectProps {
    onCatch: () => void;
    position: { top: number; left: number };
    falling: boolean;
}

const FallingObject: React.FC<FallingObjectProps> = ({ onCatch, position, falling }) => {
    const [isCaught, setIsCaught] = useState(false);

    const handleClick = () => {
        if (!isCaught) {
            setIsCaught(true);
            onCatch();
        }
    };

    if (isCaught || !falling) return null;

    return (
        <div
            className="falling-object"
            style={{ top: `${position.top}%`, left: `${position.left}%` }}
            onClick={handleClick}
        >
            +10
        </div>
    );
};

export default FallingObject;

import React, { useState, useEffect, useCallback } from 'react';
import FallingObject from './FallingObject';

const FallingObjectsContainer: React.FC = () => {
    const [objects, setObjects] = useState<{ id: number; top: number; left: number }[]>([]);
    const [startTime] = useState(Date.now());

    const addObject = useCallback(() => {
        if (objects.length < 5) { // Максимум 5 объектов
            const newObject = {
                id: Date.now(), // Уникальный ID для каждого объекта
                top: 0,
                left: Math.random() * 100
            };
            setObjects(prevObjects => [...prevObjects, newObject]);
        }
    }, [objects]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (Date.now() - startTime < 30000) { // Ограничение времени в 30 секунд
                if (objects.filter(obj => obj.top < 100).length < 2) { // Максимум 2 падающих объекта одновременно
                    addObject();
                }
            } else {
                clearInterval(intervalId);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [objects, startTime, addObject]);

    const handleCatch = () => {
        console.log("Object caught!");
    };

    const handleObjectEnd = (id: number) => {
        setObjects(prevObjects => prevObjects.filter(obj => obj.id !== id));
    };

    return (
        <div className="falling-objects-container">
            {objects.map(obj => (
                <FallingObject
                    key={obj.id}
                    onCatch={handleCatch}
                    position={{ top: obj.top, left: obj.left }}
                    onEnd={() => handleObjectEnd(obj.id)}
                />
            ))}
        </div>
    );
};

export default FallingObjectsContainer;


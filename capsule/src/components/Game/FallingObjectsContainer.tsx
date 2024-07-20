import React, { useState, useEffect } from 'react';
import FallingObject from './FallingObject';
import './fallingObjectsContainer.scss'; // Импорт стилей

const MAX_OBJECTS = 5; // Максимальное количество объектов за 30 секунд
const MAX_SIMULTANEOUS_OBJECTS = 2; // Максимум 2 объекта одновременно
const FALL_INTERVAL = 50; // Интервал падения объекта в миллисекундах

interface FallingObjectsContainerProps {
    onCatch: (coins: number) => void;
}

const FallingObjectsContainer: React.FC<FallingObjectsContainerProps> = ({ onCatch }) => {
    const [objects, setObjects] = useState<{ id: number; top: number; left: number; falling: boolean }[]>([]);
    const [activeCount, setActiveCount] = useState<number>(0);

    useEffect(() => {
        // Инициализируем 5 объектов
        const initialObjects = Array.from({ length: MAX_OBJECTS }, (_, index) => ({
            id: index,
            top: 0,
            left: Math.random() * 100,
            falling: false
        }));
        setObjects(initialObjects);
    }, []);

    useEffect(() => {
        const startFalling = (index: number) => {
            setObjects(prevObjects =>
                prevObjects.map((obj, i) => (i === index ? { ...obj, falling: true } : obj))
            );
        };

        const intervalId = setInterval(() => {
            setObjects(prevObjects => 
                prevObjects.map(obj => {
                    if (obj.falling && obj.top < 100) {
                        return { ...obj, top: obj.top + 1 };
                    }
                    if (obj.top >= 100 && obj.falling) {
                        setActiveCount(prev => prev - 1);
                        return { ...obj, falling: false };
                    }
                    return obj;
                })
            );

            // Запускаем объекты поочередно
            if (activeCount < MAX_SIMULTANEOUS_OBJECTS) {
                const nextObjectIndex = objects.findIndex(obj => !obj.falling && obj.top === 0);
                if (nextObjectIndex !== -1) {
                    startFalling(nextObjectIndex);
                    setActiveCount(prev => prev + 1);
                }
            }
        }, FALL_INTERVAL);

        return () => clearInterval(intervalId);
    }, [objects, activeCount]);

    const handleObjectCatch = (id: number) => {
        setObjects(prevObjects => prevObjects.map(obj => (obj.id === id ? { ...obj, falling: false, top: 100 } : obj)));
        setActiveCount(prev => prev - 1);
        onCatch(10); // Передаем количество монет в родительский компонент
    };

    return (
        <div className="falling-objects-container">
            {objects.map(obj => (
                <FallingObject
                    key={obj.id}
                    onCatch={() => handleObjectCatch(obj.id)}
                    position={{ top: obj.top, left: obj.left }}
                    falling={obj.falling}
                />
            ))}
        </div>
    );
};

export default FallingObjectsContainer;

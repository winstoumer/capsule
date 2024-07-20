import React, { useState, useEffect } from 'react';
import FallingObject from './FallingObject';

const MAX_OBJECTS = 5; // Максимальное количество объектов за 30 секунд
const MAX_SIMULTANEOUS_OBJECTS = 2; // Максимум 2 объекта одновременно
const FALL_INTERVAL = 50; // Интервал падения объекта в миллисекундах
const TOTAL_DURATION = 30 * 1000; // 30 секунд в миллисекундах

interface FallingObjectsContainerProps {
    onCatch: (coins: number) => void;
}

const FallingObjectsContainer: React.FC<FallingObjectsContainerProps> = ({ onCatch }) => {
    const [objects, setObjects] = useState<{ id: number; top: number; left: number; startTime: number; falling: boolean }[]>([]);

    useEffect(() => {
        // Инициализируем 5 объектов с уникальными временными метками для начала падения
        const initialObjects = Array.from({ length: MAX_OBJECTS }, (_, index) => ({
            id: index,
            top: 0,
            left: Math.random() * 100,
            startTime: Math.random() * TOTAL_DURATION,
            falling: false
        }));
        setObjects(initialObjects);
    }, []);

    useEffect(() => {
        const fallTimes = objects.map(obj => obj.startTime).sort((a, b) => a - b);

        fallTimes.forEach((time, index) => {
            setTimeout(() => {
                setObjects(prevObjects => {
                    const newObjects = [...prevObjects];
                    const currentlyFalling = newObjects.filter(obj => obj.falling).length;

                    if (currentlyFalling < MAX_SIMULTANEOUS_OBJECTS) {
                        newObjects[index].falling = true;
                    }
                    return newObjects;
                });
            }, time);
        });
    }, [objects]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setObjects(prevObjects => 
                prevObjects.map(obj => {
                    if (obj.falling && obj.top < 100) {
                        return { ...obj, top: obj.top + 1 };
                    }
                    if (obj.top >= 100 && obj.falling) {
                        return { ...obj, falling: false };
                    }
                    return obj;
                })
            );
        }, FALL_INTERVAL);

        return () => clearInterval(intervalId);
    }, []);

    const handleObjectCatch = (id: number) => {
        setObjects(prevObjects => prevObjects.map(obj => (obj.id === id ? { ...obj, falling: false, top: 100 } : obj)));
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

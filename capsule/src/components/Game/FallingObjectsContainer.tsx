import React, { useState, useEffect, useCallback } from 'react';
import FallingObject from './FallingObject';

const MAX_OBJECTS = 5; // Максимальное количество объектов за 30 секунд
const MAX_SIMULTANEOUS_OBJECTS = 2; // Максимум 2 объекта одновременно
const GAME_DURATION_MS = 30000; // 30 секунд

interface FallingObjectsContainerProps {
    onCatch: (coins: number) => void;
}

const FallingObjectsContainer: React.FC<FallingObjectsContainerProps> = ({ onCatch }) => {
    const [objects, setObjects] = useState<{ id: number; top: number; left: number }[]>([]);
    const [startTime] = useState(Date.now());

    const addObject = useCallback(() => {
        if (objects.length < MAX_OBJECTS) { // Проверка на общее количество объектов
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
            if (Date.now() - startTime < GAME_DURATION_MS) { // Проверка на время игры
                if (objects.filter(obj => obj.top < 100).length < MAX_SIMULTANEOUS_OBJECTS) { // Проверка на количество падающих объектов
                    addObject();
                }
            } else {
                clearInterval(intervalId);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [objects, startTime, addObject]);

    const handleObjectCatch = (id: number, coins: number) => {
        setObjects(prevObjects => prevObjects.filter(obj => obj.id !== id));
        onCatch(coins); // Передаем количество монет в родительский компонент
    };

    return (
        <div className="falling-objects-container">
            {objects.map(obj => (
                <FallingObject
                    key={obj.id}
                    onCatch={() => handleObjectCatch(obj.id, 10)} // Пример: передаем 10 монет при каждом пойманном объекте
                    position={{ top: obj.top, left: obj.left }}
                    onEnd={() => handleObjectCatch(obj.id, 0)} // Если нужно что-то сделать, когда объект падает
                />
            ))}
        </div>
    );
};

export default FallingObjectsContainer;

import React, { useState, useEffect, useCallback } from 'react';
import FallingObject from './FallingObject';

const MAX_OBJECTS = 15;
const MAX_SIMULTANEOUS_OBJECTS = 2;
const FALL_INTERVAL = 40;
const TOTAL_DURATION = 30 * 1000;
const EDGE_PADDING = 20;

interface FallingObjectsContainerProps {
    onCatch: (coins: number) => void;
}

const FallingObjectsContainer: React.FC<FallingObjectsContainerProps> = ({ onCatch }) => {
    const [objects, setObjects] = useState<{ id: number; top: number; left: number; startTime: number; falling: boolean; caught: boolean; disabled: boolean }[]>([]);
    
    // Функция для создания новых объектов
    const createNewObjects = (count: number) => {
        const minLeft = (EDGE_PADDING / window.innerWidth) * 100;
        const maxLeft = 100 - ((EDGE_PADDING + 40) / window.innerWidth) * 100;
        return Array.from({ length: count }, (_, index) => ({
            id: objects.length + index,
            top: 0,
            left: Math.random() * (maxLeft - minLeft) + minLeft,
            startTime: Math.random() * TOTAL_DURATION,
            falling: true,
            caught: false,
            disabled: false
        }));
    };

    // Запускаем объекты через начальное время
    const startFallingObjects = useCallback(() => {
        const sortedObjects = [...objects].sort((a, b) => a.startTime - b.startTime);
        sortedObjects.forEach(obj => {
            setTimeout(() => {
                setObjects(prevObjects => {
                    const fallingObjects = prevObjects.filter(o => o.falling && !o.caught).length;
                    if (fallingObjects < MAX_SIMULTANEOUS_OBJECTS) {
                        return prevObjects.map(o =>
                            o.id === obj.id ? { ...o, falling: true } : o
                        );
                    }
                    return prevObjects;
                });
            }, obj.startTime);
        });
    }, [objects]);

    useEffect(() => {
        // Инициализация объектов
        const initialObjects = createNewObjects(MAX_OBJECTS);
        setObjects(initialObjects);
        startFallingObjects();
    }, [startFallingObjects]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setObjects(prevObjects => {
                // Обновляем состояние объектов
                const updatedObjects = prevObjects.map(obj => {
                    if (obj.falling && !obj.caught && !obj.disabled && obj.top < 100) {
                        return { ...obj, top: obj.top + 1.2 };
                    }
                    if (obj.top >= 100 && obj.falling) {
                        return { ...obj, falling: false };
                    }
                    return obj;
                });

                // Запускаем новые объекты, если текущие объекты меньше допустимого количества
                const fallingObjects = updatedObjects.filter(o => o.falling && !o.caught).length;
                if (fallingObjects < MAX_SIMULTANEOUS_OBJECTS) {
                    const newObjects = createNewObjects(MAX_SIMULTANEOUS_OBJECTS - fallingObjects);
                    return [...updatedObjects, ...newObjects];
                }

                return updatedObjects;
            });
        }, FALL_INTERVAL);

        return () => clearInterval(intervalId);
    }, [objects]);

    const handleObjectCatch = useCallback((id: number) => {
        setObjects(prevObjects =>
            prevObjects.map(obj =>
                obj.id === id ? { ...obj, falling: false, caught: true, disabled: true } : obj
            )
        );
        onCatch(50);
    }, [onCatch]);

    return (
        <>
            {objects.map(obj => (
                <FallingObject
                    key={obj.id}
                    onCatch={() => handleObjectCatch(obj.id)}
                    position={{ top: obj.top, left: obj.left }}
                    falling={obj.falling}
                    disabled={obj.disabled} // Передаем проп disabled
                />
            ))}
        </>
    );
};

export default FallingObjectsContainer;

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
    const [objects, setObjects] = useState<{ id: number; top: number; left: number; startTime: number; falling: boolean }[]>([]);
    const [caughtObjects, setCaughtObjects] = useState<Set<number>>(new Set());

    useEffect(() => {
        const initialObjects = Array.from({ length: MAX_OBJECTS }, (_, index) => {
            const minLeft = (EDGE_PADDING / window.innerWidth) * 100;
            const maxLeft = 100 - ((EDGE_PADDING + 40) / window.innerWidth) * 100;
            return {
                id: index,
                top: 0,
                left: Math.random() * (maxLeft - minLeft) + minLeft,
                startTime: Math.random() * TOTAL_DURATION,
                falling: false
            };
        });
        setObjects(initialObjects);
    }, []);

    const startFallingObjects = useCallback(() => {
        const sortedObjects = [...objects].sort((a, b) => a.startTime - b.startTime);
        sortedObjects.forEach(obj => {
            setTimeout(() => {
                setObjects(prevObjects => {
                    const fallingObjects = prevObjects.filter(o => o.falling).length;
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
        startFallingObjects();
    }, [startFallingObjects]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setObjects(prevObjects => prevObjects.map(obj => {
                if (obj.falling && obj.top < 100) {
                    return { ...obj, top: obj.top + 1.2 };
                }
                if (obj.top >= 100 && obj.falling) {
                    return { ...obj, falling: false };
                }
                return obj;
            }).filter(obj => !caughtObjects.has(obj.id))); // Удаление пойманных объектов
        }, FALL_INTERVAL);

        return () => clearInterval(intervalId);
    }, [caughtObjects]);

    const handleObjectCatch = useCallback((id: number) => {
        setCaughtObjects(prev => new Set(prev).add(id)); // Добавляем объект в пойманные
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
                />
            ))}
        </>
    );
};

export default FallingObjectsContainer;

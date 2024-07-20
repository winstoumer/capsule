import React, { useState, useEffect } from 'react';
import FallingObject from './FallingObject';

interface FallingObjectsContainerProps {
    duration: number; // Длительность игры в секундах
    maxFallingObjects: number; // Максимальное количество падающих объектов одновременно
    maxTotalFallingObjects: number; // Максимальное количество падающих объектов за период в duration
    onCatch: () => void; // Функция, вызываемая при поимке объекта
}

const FallingObjectsContainer: React.FC<FallingObjectsContainerProps> = ({ duration, maxFallingObjects, maxTotalFallingObjects, onCatch }) => {
    const [fallingObjects, setFallingObjects] = useState<JSX.Element[]>([]);
    const [totalCreated, setTotalCreated] = useState<number>(0);

    useEffect(() => {
        const interval = duration * 1000 / maxTotalFallingObjects; // Интервал между созданиями новых объектов

        const intervalId = setInterval(() => {
            if (fallingObjects.length < maxFallingObjects && totalCreated < maxTotalFallingObjects) {
                setFallingObjects((prev) => [
                    ...prev,
                    <FallingObject key={Math.random()} onCatch={onCatch} />
                ]);
                setTotalCreated((prev) => prev + 1);
            }
        }, interval);

        return () => clearInterval(intervalId);
    }, [duration, maxFallingObjects, maxTotalFallingObjects, totalCreated, onCatch]);

    return <>{fallingObjects}</>;
};

export default FallingObjectsContainer;

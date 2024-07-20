import React, { useState, useEffect } from 'react';
import FallingObject from './FallingObject';

interface FallingObjectsContainerProps {
    duration: number;
    maxFallingObjects: number;
    maxTotalFallingObjects: number;
    onCatch: () => void;
}

const FallingObjectsContainer: React.FC<FallingObjectsContainerProps> = ({ duration, maxFallingObjects, maxTotalFallingObjects, onCatch }) => {
    const [fallingObjects, setFallingObjects] = useState<JSX.Element[]>([]);
    const [totalCreated, setTotalCreated] = useState<number>(0);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (totalCreated < maxTotalFallingObjects) {
            const interval = duration * 1000 / maxTotalFallingObjects;
            intervalId = setInterval(() => {
                if (fallingObjects.length < maxFallingObjects && totalCreated < maxTotalFallingObjects) {
                    setFallingObjects(prev => [
                        ...prev,
                        <FallingObject key={totalCreated} onCatch={onCatch} />
                    ]);
                    setTotalCreated(prev => prev + 1);
                    console.log(`Creating new falling object. Total created: ${totalCreated + 1}`);
                }
            }, interval);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [duration, maxFallingObjects, maxTotalFallingObjects, totalCreated, onCatch, fallingObjects.length]);

    return <>{fallingObjects}</>;
};

export default FallingObjectsContainer;
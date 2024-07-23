import React, { useState, useEffect, useCallback } from 'react';
import FallingObject from './FallingObject';

const MAX_OBJECTS = 15;
const MAX_SIMULTANEOUS_OBJECTS = 2;
const FALL_INTERVAL = 40;
const TOTAL_DURATION = 30 * 1000;
const EDGE_PADDING = 20;

interface FallingObjectsContainerProps {
    onCatch: (points: number) => void;
}

const FallingObjectsContainer: React.FC<FallingObjectsContainerProps> = ({ onCatch }) => {
    const [objects, setObjects] = useState<{
        id: number;
        top: number;
        left: number;
        startTime: number;
        falling: boolean;
        caught: boolean;
        appearanceTime: number; // Time when the object starts falling
        bonusPoints?: number; // Points to display when caught
    }[]>([]);
    const [startTime, setStartTime] = useState<number>(0);

    useEffect(() => {
        const initialObjects = Array.from({ length: MAX_OBJECTS }, (_, index) => {
            const minLeft = (EDGE_PADDING / window.innerWidth) * 100;
            const maxLeft = 100 - ((EDGE_PADDING + 40) / window.innerWidth) * 100;
            return {
                id: index,
                top: 0,
                left: Math.random() * (maxLeft - minLeft) + minLeft,
                startTime: Math.random() * TOTAL_DURATION,
                falling: false,
                caught: false,
                appearanceTime: 0
            };
        });
        setObjects(initialObjects);
        setStartTime(performance.now());
    }, []);

    const startFallingObjects = useCallback(() => {
        setObjects(prevObjects => {
            const currentTime = performance.now() - startTime;
            const fallingObjects = prevObjects.filter(o => o.falling && !o.caught).length;
            const availableToFall = prevObjects.filter(o => !o.falling && !o.caught && o.startTime <= currentTime);

            let toUpdate = [...prevObjects];
            availableToFall.slice(0, MAX_SIMULTANEOUS_OBJECTS - fallingObjects).forEach(obj => {
                toUpdate = toUpdate.map(o =>
                    o.id === obj.id ? { ...o, falling: true, appearanceTime: performance.now() } : o
                );
            });

            return toUpdate;
        });
    }, [startTime]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            startFallingObjects();
        }, 100);

        return () => clearInterval(intervalId);
    }, [startFallingObjects]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setObjects(prevObjects => prevObjects.map(obj => {
                if (obj.falling && !obj.caught && obj.top < 100) {
                    return { ...obj, top: obj.top + 1.2 };
                }
                if (obj.top >= 100 && obj.falling) {
                    return { ...obj, falling: false };
                }
                return obj;
            }));
        }, FALL_INTERVAL);

        return () => clearInterval(intervalId);
    }, []);

    const handleObjectCatch = useCallback((id: number) => {
        setObjects(prevObjects => {
            const updatedObjects = prevObjects.map(obj => obj.id === id ? { ...obj, caught: true } : obj);
            const caughtObject = updatedObjects.find(obj => obj.id === id);
            if (caughtObject) {
                const currentTime = performance.now();
                const elapsedTime = (currentTime - caughtObject.appearanceTime) / 1000; // convert to seconds
                let bonusPoints = 12; // Default points if caught after 3 seconds
                if (elapsedTime <= 1) bonusPoints = 6;
                else if (elapsedTime <= 2) bonusPoints = 10;

                onCatch(50 + bonusPoints); // Add the bonus points
                // Pass the bonus points to the floating numbers
                setObjects(prevObjects => prevObjects.map(obj =>
                    obj.id === id ? { ...obj, bonusPoints } : obj
                ));
            }
            return updatedObjects;
        });
    }, [onCatch]);

    return (
        <>
            {objects.map(obj => (
                <FallingObject
                    key={obj.id}
                    onCatch={() => handleObjectCatch(obj.id)}
                    position={{ top: obj.top, left: obj.left }}
                    falling={obj.falling}
                    caught={obj.caught}
                    bonusPoints={obj.bonusPoints}
                />
            ))}
        </>
    );
};

export default FallingObjectsContainer;

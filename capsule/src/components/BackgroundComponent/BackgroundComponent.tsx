import React, { useEffect, useState } from 'react';
import './backgroundComponent.scss';

const BackgroundComponent: React.FC = () => {
  const [bubbles, setBubbles] = useState<{ left: number; top: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(addRandomBubble, 1000); // Добавлять новый шар каждую секунду

    return () => clearInterval(interval);
  }, []);

  const addRandomBubble = () => {
    const randomLeft = Math.random() * window.innerWidth;
    const randomTop = Math.random() * window.innerHeight;

    setBubbles([...bubbles, { left: randomLeft, top: randomTop }]);
  };

  return (
    <div className="background-container">
      <div className="background">
        {bubbles.map((bubble, index) => (
          <div
            key={index}
            className="bubble"
            style={{ left: bubble.left, top: bubble.top }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundComponent;
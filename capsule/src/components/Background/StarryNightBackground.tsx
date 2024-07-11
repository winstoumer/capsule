import React, { useState, useEffect } from 'react';
import './StarryNightBackground.scss'; // Подключаем файл стилей CSS

interface StarProps {
  id: number;
  x: number;
  y: number;
  speed: number;
  upwardSpeed: number;
  downwardSpeed: number;
}

const StarryNightBackground: React.FC<{ maxStars: number; falling?: boolean }> = ({ maxStars, falling = false }) => {
  const [stars, setStars] = useState<StarProps[]>([]);

  useEffect(() => {
    const initialStars = Array.from({ length: maxStars }, (_, index) => ({
      id: index,
      x: Math.random() * window.innerWidth,   // Начальная позиция x
      y: Math.random() * window.innerHeight,  // Начальная позиция y
      speed: Math.random() * 2 + 1,           // Скорость по умолчанию для движения вверх
      upwardSpeed: Math.random() * 1 + 0.5,   // Скорость движения вверх (медленно)
      downwardSpeed: Math.random() * 10 + 5,  // Скорость движения вниз (быстро)
    }));

    setStars(initialStars);

    const interval = setInterval(() => {
      setStars(prevStars => (
        prevStars.map(star => ({
          ...star,
          y: falling ? star.y + star.downwardSpeed : star.y - star.upwardSpeed,  // Движение вверх или вниз
          // Если звезда исчезла за пределами экрана, создать новую в случайной позиции
          ...(falling ? (star.y > window.innerHeight ? { x: Math.random() * window.innerWidth, y: 0 } : {}) :
                       (star.y < 0 ? { x: Math.random() * window.innerWidth, y: window.innerHeight } : {}))
        }))
      ));
    }, 50);

    return () => clearInterval(interval);
  }, [maxStars, falling]);

  return (
    <div className="starry-night-background">
      {stars.map(star => (
        <div key={star.id} className="star" style={{ left: star.x, top: star.y }}></div>
      ))}
    </div>
  );
};

export default StarryNightBackground;

import React, { useState, useEffect } from 'react';
import './StarryNightBackground.scss'; // Подключаем файл стилей CSS

interface StarProps {
  id: number;
  x: number;
  y: number;
  speed: number;
}

const StarryNightBackground: React.FC<{ maxStars: number; falling?: boolean }> = ({ maxStars, falling = false }) => {
  const [stars, setStars] = useState<StarProps[]>([]);

  useEffect(() => {
    const initialStars = Array.from({ length: maxStars }, (_, index) => ({
      id: index,
      x: Math.random() * window.innerWidth,   // Начальная позиция x
      y: Math.random() * window.innerHeight,  // Начальная позиция y
      speed: Math.random() * 10 + 5,          // Скорость движения звезды (быстро вниз)
    }));

    setStars(initialStars);

    const interval = setInterval(() => {
      setStars(prevStars => (
        prevStars.map(star => ({
          ...star,
          y: falling ? star.y + star.speed : star.y - star.speed,  // Движение вверх или вниз
          // Если звезда исчезла за пределами экрана, создать новую в случайной позиции
          ...(falling ? (star.y > window.innerHeight ? { x: Math.random() * window.innerWidth, y: 0, speed: Math.random() * 10 + 5 } : {}) : 
                       (star.y < 0 ? { x: Math.random() * window.innerWidth, y: window.innerHeight, speed: Math.random() * 10 + 5 } : {}))
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

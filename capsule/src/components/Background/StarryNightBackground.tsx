import React, { useState, useEffect } from 'react';
import './StarryNightBackground.scss'; // Подключаем файл стилей CSS

const StarryNightBackground: React.FC<{ maxStars: number }> = ({ maxStars }) => {
  const [stars, setStars] = useState<{ id: number, x: number, y: number, speed: number }[]>([]);

  // Создание начальных позиций и скорости для звёзд
  useEffect(() => {
    const initialStars = Array.from({ length: maxStars }, (_, index) => ({
      id: index,
      x: Math.random() * window.innerWidth,   // Начальная позиция x
      y: Math.random() * window.innerHeight,  // Начальная позиция y
      speed: Math.random() * 2 + 1,           // Скорость движения звезды
    }));

    setStars(initialStars);

    // Обновление позиций звёзд каждые 50 миллисекунд
    const interval = setInterval(() => {
      setStars(prevStars => (
        prevStars.map(star => ({
          ...star,
          y: star.y - star.speed,  // Движение вверх (уменьшение y координаты)
          // Если звезда исчезла за пределами экрана, создать новую в случайной позиции
          ...(star.y + star.speed < 0 ? { x: Math.random() * window.innerWidth, y: window.innerHeight, speed: Math.random() * 2 + 1 } : {})
        }))
      ));
    }, 50);

    return () => clearInterval(interval); // Остановка интервала при размонтировании компонента
  }, [maxStars]);

  return (
    <div className="starry-night-background">
      {/* Отрисовка звёзд */}
      {stars.map(star => (
        <div key={star.id} className="star" style={{ left: star.x, top: star.y }}></div>
      ))}
    </div>
  );
};

export default StarryNightBackground;

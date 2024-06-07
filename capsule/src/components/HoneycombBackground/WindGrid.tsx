import React, { useState, useEffect } from 'react';
import './WindGrid.scss';

const WindGrid: React.FC = () => {
  const [windStrength, setWindStrength] = useState<number>(0);

  useEffect(() => {
    const handleWindStrengthChange = () => {
      // Эмулируем изменение силы ветра в диапазоне от 0 до 100
      const newWindStrength = Math.floor(Math.random() * 101);
      setWindStrength(newWindStrength);
    };

    // Эмулируем изменение силы ветра каждые 3 секунды
    const interval = setInterval(handleWindStrengthChange, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="wind-grid-container">
      <div className="wind-grid" style={{ '--wind-strength': windStrength } as React.CSSProperties}></div>
    </div>
  );
};

export default WindGrid;


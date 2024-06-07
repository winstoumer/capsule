import React, { useState, useEffect } from 'react';
import './WindGrid.scss';

const WindGrid: React.FC = () => {
  const [windStrength, setWindStrength] = useState<number>(0);

  useEffect(() => {
    const handleWindStrengthChange = () => {
      const newWindStrength = Math.floor(Math.random() * 101);
      setWindStrength(newWindStrength);
    };

    const interval = setInterval(handleWindStrengthChange, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="wind-grid">
      <div className="dots-container">
        {Array.from({ length: 20 }).map((_, rowIndex) => (
          Array.from({ length: 20 }).map((_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="dot"
              style={{
                '--wind-strength': windStrength,
                left: `${colIndex * 5}vw`,
                top: `${rowIndex * 5}vh`
              } as React.CSSProperties}
            ></div>
          ))
        ))}
      </div>
    </div>
  );
};

export default WindGrid;



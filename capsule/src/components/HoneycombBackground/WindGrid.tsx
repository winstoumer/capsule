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
      {Array.from({ length: 100 }).map((_, index) => (
        <div key={index} className="dot" style={{ '--wind-strength': windStrength } as React.CSSProperties}></div>
      ))}
    </div>
  );
};

export default WindGrid;

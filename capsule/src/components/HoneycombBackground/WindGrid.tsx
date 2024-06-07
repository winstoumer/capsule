import React, { useState, useEffect } from 'react';
import './WindGrid.scss';

const WindGrid: React.FC = () => {
  const [quantumSpin, setQuantumSpin] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuantumSpin((prevQuantumSpin) => !prevQuantumSpin);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="wind-grid">
      <div className="dots-container">
        {Array.from({ length: 20 }).map((_, rowIndex) => (
          Array.from({ length: 20 }).map((_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`dot ${quantumSpin ? 'quantum-spin' : ''}`}
              style={{
                left: `${colIndex * 5}vw`,
                top: `${rowIndex * 5}vh`
              }}
            ></div>
          ))
        ))}
      </div>
    </div>
  );
};

export default WindGrid;



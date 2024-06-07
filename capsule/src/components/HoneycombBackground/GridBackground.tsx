import React from 'react';
import './GridBackground.scss';

const GridBackground: React.FC = () => {
  return (
    <div className="grid-background">
      <div className="grid-container">
        {[...Array(50)].map((_, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {[...Array(50)].map((_, colIndex) => (
              <div key={colIndex} className="grid-cell" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridBackground;

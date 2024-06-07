import React from 'react';
import './WaveGrid.scss';

const WaveGrid: React.FC = () => {
  return (
    <div className="grid-background">
      {[...Array(50)].map((_, index) => (
        <div key={index} className="grid-cell" />
      ))}
    </div>
  );
};

export default WaveGrid;



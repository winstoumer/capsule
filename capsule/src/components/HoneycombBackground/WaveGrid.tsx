import React from 'react';
import './WaveGrid.scss';

const WaveGrid: React.FC = () => {
  const numRows = 10; // количество строк
  const numCols = 15; // количество столбцов
  const waveAmplitude = 20; // амплитуда волны
  const waveFrequency = 0.1; // частота волны

  const renderWaveGrid = () => {
    const grid = [];
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const x = col * 50; // ширина прямоугольника
        const y = row * 50; // высота прямоугольника
        const waveOffset = Math.sin(col * waveFrequency) * waveAmplitude; // смещение по волне
        const rectHeight = 50 + waveOffset; // высота прямоугольника с учетом волны
        grid.push(<rect x={x} y={y} width="50" height={rectHeight} key={`${row}-${col}`} />);
      }
    }
    return grid;
  };

  return (
    <svg className="wave-grid" width="100%" height="100%">
      {renderWaveGrid()}
    </svg>
  );
};

export default WaveGrid;



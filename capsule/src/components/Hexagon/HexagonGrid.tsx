// src/components/Hexagon/HexagonGrid.tsx
import React from 'react';
import Hexagon from './Hexagon';
import styles from './HexagonGrid.module.scss';

const HexagonGrid: React.FC = () => {
  const size = 50; // Размер одного шестиугольника
  const fill = 'transparent'; // Цвет шестиугольника
  const hexagons = [];

  const diameter = Math.min(window.innerHeight, window.innerWidth) * 0.9;
  const radius = diameter / 2;
  const rows = Math.ceil(diameter / (Math.sqrt(3) * size));
  const cols = Math.ceil(diameter / (1.5 * size));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * size * 1.5;
      const y = row * Math.sqrt(3) * size + (col % 2 ? Math.sqrt(3) * 0.5 * size : 0);
      const dx = x - radius;
      const dy = y - radius;
      if (dx * dx + dy * dy < radius * radius) {
        hexagons.push(
          <g key={`${row}-${col}`} transform={`translate(${x},${y})`}>
            <Hexagon size={size} fill={fill} />
          </g>
        );
      }
    }
  }

  return (
    <div className={styles.container}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${cols * size * 1.5} ${rows * Math.sqrt(3) * size}`}
        className={styles.svgContainer}
      >
        {hexagons}
      </svg>
    </div>
  );
};

export default HexagonGrid;

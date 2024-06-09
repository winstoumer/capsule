// src/components/Hexagon/Hexagon.tsx
import React from 'react';
import styles from './Hexagon.module.scss';

interface HexagonProps {
  size: number;
  fill: string;
}

const Hexagon: React.FC<HexagonProps> = ({ size, fill }) => {
  const points = [
    [0.5 * size, 0],
    [1.5 * size, 0],
    [2 * size, Math.sqrt(3) * 0.5 * size],
    [1.5 * size, Math.sqrt(3) * size],
    [0.5 * size, Math.sqrt(3) * size],
    [0, Math.sqrt(3) * 0.5 * size]
  ]
  .map(point => point.join(','))
  .join(' ');

  return (
    <svg
      className={styles.hexagon}
      width={2 * size}
      height={Math.sqrt(3) * size}
      viewBox={`0 0 ${2 * size} ${Math.sqrt(3) * size}`}
    >
      <polygon points={points} fill={fill} />
    </svg>
  );
};

export default Hexagon;
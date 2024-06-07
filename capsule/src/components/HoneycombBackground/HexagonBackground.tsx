import React from 'react';
import './hexagonBackground.scss';

const HexagonBackground: React.FC = () => {
  const size = 30; // Размер шестиугольника (радиус)
  const height = size * 2;
  const vert = height * 0.75;
  const width = Math.sqrt(3) / 2 * height;

  const createHexagonPoints = (x: number, y: number, size: number) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const hx = x + size * Math.cos(angle);
      const hy = y + size * Math.sin(angle);
      points.push(`${hx},${hy}`);
    }
    return points.join(' ');
  };

  const hexagons = [];
  const cols = Math.ceil(window.innerWidth / width);
  const rows = Math.ceil(window.innerHeight / vert);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const xOffset = col * width;
      const yOffset = row * vert + (col % 2 === 0 ? 0 : vert / 2);
      const points = createHexagonPoints(xOffset, yOffset, size);
      hexagons.push(<polygon points={points} stroke="#888" fill="none" strokeWidth="1" key={`${row}-${col}`} />);
    }
  }

  return (
    <svg className="hexagon-background" width="100%" height="100%">
      {hexagons}
    </svg>
  );
};

export default HexagonBackground;

import React from 'react';
import './planet.scss';

interface PlanetProps {
  size: number;
  color: string;
  top: string;
  left: string;
}

const Planet: React.FC<PlanetProps> = ({ size, color, top, left }) => {
  const planetStyle: React.CSSProperties = {
    width: size,
    height: size,
    backgroundColor: color,
    borderRadius: '50%',
    position: 'absolute',
    top,
    left,
    animation: `scaleAnimation 10s infinite alternate`,
  };

  return <div className="planet" style={planetStyle} />;
};

const PlanetAnimation: React.FC = () => {
  const planetColors = ['#15013E', '#FFF198', '#0D0F12', '#AA0123', '#002933', '#15013E', '#FFF198', '#0D0F12', '#AA0123', '#002933', '#15013E', '#FFF198', '#0D0F12', '#AA0123', '#002933', '#15013E', '#FFF198', '#0D0F12', '#AA0123', '#002933', '#15013E', '#FFF198', '#0D0F12', '#AA0123', '#002933', '#15013E', '#FFF198', '#0D0F12', '#AA0123', '#002933'];

  const generateRandomPosition = (): string => {
    return `${Math.floor(Math.random() * 100)}%`;
  };

  const generateRandomPlanet = (): JSX.Element => {
    const size = Math.floor(Math.random() * (20 - 20 + 1)) + 6;
    const color = planetColors[Math.floor(Math.random() * planetColors.length)];
    const top = generateRandomPosition();
    const left = generateRandomPosition();
    return <Planet key={Math.random()} size={size} color={color} top={top} left={left} />;
  };

  return (
    <div className="planetContainer">
      {[...Array(30)].map(() => generateRandomPlanet())}
    </div>
  );
};

export default PlanetAnimation;
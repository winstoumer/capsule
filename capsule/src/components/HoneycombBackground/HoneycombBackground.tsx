import React from 'react';
import styles from './honeycombBackground.module.scss';

const HoneycombBackground: React.FC = () => {
  const hexagons = Array.from({ length: 30 }, (_, index) => (
    <div className={styles.hex} key={index}></div>
  ));

  const rows = Array.from({ length: 10 }, (_, rowIndex) => (
    <div className={styles['hex-row']} key={rowIndex}>
      {hexagons.slice(rowIndex * 3, rowIndex * 3 + 3)}
    </div>
  ));

  return <div className={styles.honeycomb}>{rows}</div>;
};

export default HoneycombBackground;
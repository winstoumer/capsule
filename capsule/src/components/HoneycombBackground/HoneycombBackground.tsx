import React from 'react';
import styles from './honeycombBackground.module.scss';

const HoneycombBackground: React.FC = () => {
  // Calculate the number of hexagons needed to fill the screen
  const numRows = Math.ceil(window.innerHeight / 115.47) + 2;
  const numCols = Math.ceil(window.innerWidth / 100) + 2;

  return (
    <div className={styles.honeycomb}>
      {[...Array(numRows)].map((_, rowIndex) => (
        <div className={styles['hex-row']} key={rowIndex}>
          {[...Array(numCols)].map((_, colIndex) => (
            <div className={styles.hex} key={`${rowIndex}-${colIndex}`}>
              <svg viewBox="0 0 100 115.47" xmlns="http://www.w3.org/2000/svg">
                <polygon points="50,0 100,28.87 100,86.6 50,115.47 0,86.6 0,28.87" fill="none" stroke="#777" strokeWidth="1"/>
              </svg>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default HoneycombBackground;




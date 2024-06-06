import React from 'react';
import styles from './honeycombBackground.module.scss';

const HoneycombBackground: React.FC = () => {
  const rows = 10;
  const columns = 10;

  return (
    <div className={styles.honeycomb}>
      {[...Array(rows)].map((_, rowIndex) => (
        <div className={styles['hex-row']} key={rowIndex}>
          {[...Array(columns)].map((_, colIndex) => (
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




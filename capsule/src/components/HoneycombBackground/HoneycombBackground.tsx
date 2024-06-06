import React from 'react';
import styles from './HoneycombBackground.module.scss';

const HoneycombBackground: React.FC = () => {
  return (
    <div className={styles.honeycomb}>
      <div className={styles['hex-row']}>
        {[...Array(6)].map((_, colIndex) => (
          <div className={styles['side-hex']} key={`left-${colIndex}`}>
            <svg viewBox="0 0 100 57.74" xmlns="http://www.w3.org/2000/svg">
              <polygon points="50,0 100,28.87 100,86.6 50,115.47 0,86.6 0,28.87" fill="none" stroke="#777" strokeWidth="1"/>
            </svg>
          </div>
        ))}
      </div>
      {[...Array(10)].map((_, rowIndex) => (
        <div className={styles['hex-row']} key={rowIndex}>
          {[...Array(5)].map((_, colIndex) => (
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

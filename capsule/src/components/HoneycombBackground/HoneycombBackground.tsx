import React, { useEffect, useState } from 'react';
import styles from './honeycombBackground.module.scss';

const HoneycombBackground: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const rows = Math.ceil(dimensions.height / 115.47) + 1;
  const columns = Math.ceil(dimensions.width / 100) + 1;

  return (
    <div className={styles['honeycomb-container']}>
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
    </div>
  );
};

export default HoneycombBackground;

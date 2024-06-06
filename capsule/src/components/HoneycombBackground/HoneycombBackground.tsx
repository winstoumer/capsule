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

  const rows = Math.ceil(dimensions.height / 86.6) + 1;
  const columns = Math.ceil(dimensions.width / 75) + 1;

  return (
    <div className={styles.honeycomb}>
      {[...Array(rows)].map((_, rowIndex) => (
        <div className={styles['hex-row']} key={rowIndex}>
          {[...Array(columns)].map((_, colIndex) => (
            <div className={styles.hex} key={`${rowIndex}-${colIndex}`}>
              <div></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default HoneycombBackground;



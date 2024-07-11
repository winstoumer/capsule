import React from 'react';

const StarryNightBackground: React.FC = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" style={{ position: 'fixed', width: '100%', height: '100%', top: 0, left: 0 }}>
      <defs>
        <radialGradient id="skyGradient" cx="50%" cy="50%" r="75%">
          <stop offset="0%" style={{ stopColor: '#001848', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#000000', stopOpacity: 1 }} />
        </radialGradient>
        <radialGradient id="starGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#ffffcc', stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      <rect width="400" height="400" fill="url(#skyGradient)" />

      {/* Stars */}
      <g id="stars">
        <circle cx="50" cy="100" r="2" fill="url(#starGradient)" />
        <circle cx="200" cy="50" r="1.5" fill="url(#starGradient)" />
        <circle cx="300" cy="150" r="2.5" fill="url(#starGradient)" />
        <circle cx="150" cy="200" r="1" fill="url(#starGradient)" />
        <circle cx="250" cy="250" r="2" fill="url(#starGradient)" />
        <circle cx="100" cy="300" r="1.5" fill="url(#starGradient)" />
        <circle cx="350" cy="350" r="2.5" fill="url(#starGradient)" />
      </g>
    </svg>
  );
};

export default StarryNightBackground;

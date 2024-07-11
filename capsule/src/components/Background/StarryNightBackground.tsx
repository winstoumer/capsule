import React from 'react';

const StarryNightBackground: React.FC = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" style={{ position: 'fixed', width: '100%', height: '100%', top: 0, left: 0, zIndex: -1 }}>
      <defs>
        <radialGradient id="starGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#ffffcc', stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      {/* Stars */}
      <circle cx="50" cy="100" r="2">
        <animate attributeName="cx" from="50" to="450" dur="5s" repeatCount="indefinite" />
        <animate attributeName="cy" from="100" to="-50" dur="5s" repeatCount="indefinite" />
      </circle>

      <circle cx="200" cy="50" r="1.5">
        <animate attributeName="cx" from="200" to="550" dur="4s" repeatCount="indefinite" />
        <animate attributeName="cy" from="50" to="-100" dur="4s" repeatCount="indefinite" />
      </circle>

      <circle cx="300" cy="150" r="2.5">
        <animate attributeName="cx" from="300" to="650" dur="6s" repeatCount="indefinite" />
        <animate attributeName="cy" from="150" to="-150" dur="6s" repeatCount="indefinite" />
      </circle>

      <circle cx="150" cy="200" r="1">
        <animate attributeName="cx" from="150" to="500" dur="3s" repeatCount="indefinite" />
        <animate attributeName="cy" from="200" to="-200" dur="3s" repeatCount="indefinite" />
      </circle>

      <circle cx="250" cy="250" r="2">
        <animate attributeName="cx" from="250" to="600" dur="4.5s" repeatCount="indefinite" />
        <animate attributeName="cy" from="250" to="-250" dur="4.5s" repeatCount="indefinite" />
      </circle>

      <circle cx="100" cy="300" r="1.5">
        <animate attributeName="cx" from="100" to="550" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="cy" from="300" to="-300" dur="3.5s" repeatCount="indefinite" />
      </circle>

      <circle cx="350" cy="350" r="2.5">
        <animate attributeName="cx" from="350" to="700" dur="5s" repeatCount="indefinite" />
        <animate attributeName="cy" from="350" to="-350" dur="5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
};

export default StarryNightBackground;

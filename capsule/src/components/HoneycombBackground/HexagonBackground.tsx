import React, { useEffect, useRef } from 'react';
import './hexagonBackground.scss';

const HexagonBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const hexRadius = 30; // Radius of the hexagon
    const hexWidth = Math.sqrt(3) * hexRadius;
    const hexHeight = 2 * hexRadius;

    const resizeCanvas = () => {
      const cols = Math.ceil(window.innerWidth / hexWidth); // Number of columns
      const rows = Math.ceil(window.innerHeight / (hexHeight * 0.75)); // Number of rows

      canvas.width = cols * hexWidth;
      canvas.height = rows * hexHeight * 0.75;

      drawHexagons(ctx, cols, rows, hexWidth, hexHeight, hexRadius);
    };

    const drawHexagons = (ctx: CanvasRenderingContext2D, cols: number, rows: number, hexWidth: number, hexHeight: number, radius: number) => {
      ctx.fillStyle = '#f0f0f0'; // Hexagon fill color
      ctx.strokeStyle = '#f0f0f0'; // Hexagon border color

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const xOffset = x * hexWidth * 0.75;
          const yOffset = y * hexHeight + (x % 2) * hexHeight * 0.5;
          drawHexagon(ctx, xOffset, yOffset, radius);
        }
      }
    };

    const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = x + radius * Math.cos(angle);
        const hy = y + radius * Math.sin(angle);
        ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial draw

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="hexagon-background"></canvas>;
};

export default HexagonBackground;





import React, { useEffect, useRef } from 'react';
import './hexagonBackground.scss';

const HexagonBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 30; // Размер шестиугольника (радиус)
    const height = size * 2;
    const vert = height * 0.75;
    const width = Math.sqrt(3) / 2 * height;
    const horiz = width;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawHexagons(ctx, canvas.width, canvas.height, size, horiz, vert);
    };

    const drawHexagons = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, size: number, horiz: number, vert: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000'; // Цвет фона
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#fff'; // Цвет линии шестиугольника
      ctx.lineWidth = 1;

      const cols = Math.ceil(canvasWidth / horiz);
      const rows = Math.ceil(canvasHeight / vert);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const xOffset = col * horiz;
          const yOffset = row * vert + (col % 2 === 0 ? 0 : vert / 2);
          drawHexagon(ctx, xOffset, yOffset, size);
        }
      }
    };

    const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = x + size * Math.cos(angle);
        const hy = y + size * Math.sin(angle);
        ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Первоначальный вызов

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="hexagon-background"></canvas>;
};

export default HexagonBackground;

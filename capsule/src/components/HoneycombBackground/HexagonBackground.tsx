import React, { useEffect, useRef } from 'react';
import './hexagonBackground.scss';

const HexagonBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const hexRadius = 30; // Радиус шестиугольника
    const hexHeight = Math.sqrt(3) * hexRadius;
    const hexWidth = 2 * hexRadius;
    const hexVerticalSpacing = hexHeight;
    const hexHorizontalSpacing = 1.5 * hexRadius;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawHexagons(ctx, canvas.width, canvas.height, hexWidth, hexHeight, hexRadius, hexHorizontalSpacing, hexVerticalSpacing);
    };

    const drawHexagons = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, hexWidth: number, hexHeight: number, radius: number, hexHorizontalSpacing: number, hexVerticalSpacing: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000'; // Цвет фона
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#fff'; // Цвет линии шестиугольника
      ctx.lineWidth = 1;

      const cols = Math.ceil(canvasWidth / hexHorizontalSpacing);
      const rows = Math.ceil(canvasHeight / hexVerticalSpacing);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const xOffset = col * hexHorizontalSpacing;
          const yOffset = row * hexVerticalSpacing + (col % 2 === 0 ? 0 : hexHeight / 2);
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

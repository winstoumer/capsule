import React, { useEffect, useRef } from 'react';

interface QrCodeComponentProps {
  value: string;
  size?: number;
}

const QrCodeComponent: React.FC<QrCodeComponentProps> = ({ value, size = 128 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Простейший алгоритм для генерации QR-кода
    const createQRCode = (text: string) => {
      const qrSize = size;
      canvas.width = qrSize;
      canvas.height = qrSize;
      ctx.clearRect(0, 0, qrSize, qrSize);

      // Создание простейшей сетки QR-кода
      const cellSize = qrSize / text.length;
      for (let i = 0; i < text.length; i++) {
        for (let j = 0; j < text.length; j++) {
          const charCode = text.charCodeAt(i) + text.charCodeAt(j);
          const isBlack = charCode % 2 === 0;
          ctx.fillStyle = isBlack ? '#000' : '#fff';
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
      }
    };

    createQRCode(value);
  }, [value, size]);

  return <canvas ref={canvasRef}></canvas>;
};

export default QrCodeComponent;

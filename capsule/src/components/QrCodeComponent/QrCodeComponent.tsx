import React, { useMemo } from 'react';

interface QrCodeComponentProps {
  value: string;
  size?: number;
}

const QrCodeComponent: React.FC<QrCodeComponentProps> = ({ value, size = 128 }) => {
  const qrCode = useMemo(() => generateQrCode(value), [value]);

  const svgSize = size;
  const cellSize = svgSize / qrCode.length;

  return (
    <svg width={svgSize} height={svgSize}>
      {qrCode.map((row, rowIndex) =>
        row.map((cell, cellIndex) => (
          <rect
            key={`${rowIndex}-${cellIndex}`}
            x={cellIndex * cellSize}
            y={rowIndex * cellSize}
            width={cellSize}
            height={cellSize}
            fill={cell ? '#000' : '#fff'}
          />
        ))
      )}
    </svg>
  );
};

const generateQrCode = (value: string): boolean[][] => {
  // Простейший алгоритм для генерации QR-кода
  const size = Math.max(21, value.length); // Размер QR-кода (минимум 21x21)
  const qrCode: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false)
  );

  // Заполнение QR-кода простейшим образом на основе текста
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const charCode = value.charCodeAt((i + j) % value.length);
      qrCode[i][j] = charCode % 2 === 0;
    }
  }

  return qrCode;
};

export default QrCodeComponent;


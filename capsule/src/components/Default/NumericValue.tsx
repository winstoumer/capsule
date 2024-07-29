import React from 'react';

interface NumericValueProps {
  value: number | string | null | undefined;
  decimalPlaces?: number;
}

const NumericValue: React.FC<NumericValueProps> = ({ value, decimalPlaces = 0 }) => {
  let formattedValue: string = 'N/A';

  // Try to parse the value to a number if it's a string
  if (typeof value === 'string') {
    value = parseFloat(value.replace(/,/g, ''));
  }

  // Check if the value is a valid number
  if (typeof value === 'number' && !isNaN(value)) {
    formattedValue = value.toLocaleString(undefined, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    });
  } else {
    console.warn('NumericValue received invalid number:', value, 'Type:', typeof value);
  }

  return <span>{formattedValue}</span>;
};

export default NumericValue;

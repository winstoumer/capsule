import 'react';

interface NumericValueProps {
  value: number | null | undefined;
  decimalPlaces?: number;
}

const NumericValue: React.FC<NumericValueProps> = ({ value, decimalPlaces = 0 }) => {
  let formattedValue: string = 'N/A';

  if (typeof value === 'number' && !isNaN(value)) {
    formattedValue = value.toLocaleString(undefined, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    });
  } else {
    console.warn('Invalid value for NumericValue:', value); // Warning for unexpected value types
  }

  return (
    <span>{formattedValue}</span>
  );
};

export default NumericValue;

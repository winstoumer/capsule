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
  }

  return (
    <span>{formattedValue}</span>
  );
};

export default NumericValue;

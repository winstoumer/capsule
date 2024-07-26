import React from 'react';

interface NumericValueProps {
    value: number | null | undefined;
    decimalPlaces?: number;
}

const NumericValue: React.FC<NumericValueProps> = ({ value, decimalPlaces = 0 }) => {
    let formattedValue = 'N/A';

    if (typeof value === 'number' && !isNaN(value)) {
        formattedValue = value.toFixed(decimalPlaces);
        formattedValue = Number(formattedValue).toLocaleString(undefined);
    }

    return (
        <>{formattedValue}</>
    );
};

export default NumericValue;

import React from 'react';
import './itemParameters.scss';

interface ItemParametersProps {
  name: string;
  value: string | number | undefined;
  suffix?: string;
}

const ItemParameters: React.FC<ItemParametersProps> = ({ name, value, suffix }) => {
  return (
    <div className="item-with-dots">
      <span className="item-name">{name}</span>
      <span className="dots"></span>
      <span className="item-value">
        {value}{suffix}
      </span>
    </div>
  );
};

export default ItemParameters;

import React from 'react';
import './itemParameters.scss';

interface ItemParametersProps {
  name: string;
  value: string | number | undefined;
}

const ItemParameters: React.FC<ItemParametersProps> = ({ name, value }) => {
  return (
    <div className="item-with-dots">
      <span className="item-name">{name}</span>
      <span className="dots"></span>
      <span className="item-value">{value}</span>
    </div>
  );
};

export default ItemParameters;

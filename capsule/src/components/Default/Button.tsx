import React from 'react';
import './Button.scss'; // Импортируем файл стилей SCSS

interface ButtonProps {
  onClick: () => void;
  background?: string;
  text: string;
  custom?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  background = 'transparent',
  text,
  custom = false
}) => {
  const buttonStyle: React.CSSProperties = {
    backgroundColor: background,
  };

  return (
    <button className={`mod-button ${custom ? 'mod-custom-button' : ''}`} style={buttonStyle} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;

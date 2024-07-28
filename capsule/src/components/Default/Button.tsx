import React from 'react';
import './Button.scss';
import IconType from './IconType';

interface ButtonProps {
  onClick?: () => void; // Make onClick optional
  background?: string;
  text: string | JSX.Element;
  custom?: boolean;
  disabled?: boolean;
  icon?: IconType;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  background = 'transparent',
  text,
  custom = false,
  disabled = false, // Default to false
  icon
}) => {
  const buttonStyle: React.CSSProperties = {
    backgroundColor: background,
  };

  // Only attach onClick handler if the button is not disabled
  const handleClick = disabled ? undefined : onClick;

  return (
    <button
      className={`mod-button ${custom ? 'mod-custom-button' : ''}`}
      style={buttonStyle}
      onClick={handleClick}
    >
      {icon && <IconType type={icon} />}
      {typeof text === 'string' ? text : <span dangerouslySetInnerHTML={{ __html: text }} />}
    </button>
  );
};

export default Button;

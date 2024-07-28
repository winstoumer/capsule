import React from 'react';
import './Button.scss';
import IconType from './IconType';

interface ButtonProps {
  onClick?: () => void;
  background?: string;
  text: string | JSX.Element;
  custom?: boolean;
  disabled?: boolean;
  // Icon Props
  icon?: IconType;
  iconSize?: number;
  iconBorder?: boolean;
  sizeFill?: number;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  background = 'transparent',
  text,
  custom = false,
  disabled = false,
  // Icon Props
  icon,
  iconSize,
  iconBorder = false,
  sizeFill,
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
      {icon && <IconType type={icon} size={iconSize} border={iconBorder} sizeFill={sizeFill} />}
      {typeof text === 'string' ? text : <span dangerouslySetInnerHTML={{ __html: text }} />}
    </button>
  );
};

export default Button;

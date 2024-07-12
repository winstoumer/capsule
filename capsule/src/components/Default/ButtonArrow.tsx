import React from 'react';
import './Button.scss'; // Import the SCSS file for styles

interface ButtonProps {
  onClick: () => void;
  arrowType: 'previous' | 'next'; // Specify the type of arrow: previous or next
}

const previousArrow = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 19L8 12L15 5"
      stroke="white"
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const nextArrow = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 5L16 12L9 19"
      stroke="white"
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ButtonArrow: React.FC<ButtonProps> = ({ onClick, arrowType }) => {
  let arrow: JSX.Element;
  let arrowClassName: string;

  if (arrowType === 'previous') {
    arrow = previousArrow;
    arrowClassName = 'arrow-button arrow-left';
  } else {
    arrow = nextArrow;
    arrowClassName = 'arrow-button arrow-right';
  }

  return (
    <button className={arrowClassName} onClick={onClick}>
      {arrow}
    </button>
  );
};

export default ButtonArrow;
import React from 'react';
import './iconType.scss';

// Определяем типы для поддерживаемых иконок
type IconType = 'arrow-left' | 'arrow-right' | 'checkmark' | 'error' | 'info' | 'task' | 'leaderboard' | 'frens';

// Определяем пропсы компонента иконок
interface IconProps extends React.SVGProps<SVGSVGElement> {
    type: IconType;
    size?: number | string; // Поддержка размера иконки
    color?: string; // Поддержка цвета
    strokeColor?: string;
    onClick?: React.MouseEventHandler<SVGSVGElement>; // Поддержка обработчика клика
}

// Компонент иконок
const IconType: React.FC<IconProps> = ({ type, size = 24, strokeColor = '#CF00F8', color = 'none', onClick, ...props }) => {
    const commonProps = {
        width: size,
        height: size,
        fill: color,
        onClick,
        ...props
    };

    const pathProps = {
        stroke: strokeColor,
        strokeWidth: 0.5
    };

    switch (type) {
        case 'arrow-left':
            return (
                <span className='icon-type'>
                    <svg
                        viewBox="0 0 24 24"
                        {...commonProps}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M15 19L8 12L15 5"
                            {...pathProps}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            );
        case 'arrow-right':
            return (
                <span className='icon-type'>
                    <svg
                        viewBox="0 0 24 24"
                        {...commonProps}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M9 5L16 12L9 19"
                            {...pathProps}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            );
        case 'checkmark':
            return (
                <span className='icon-type'>
                    <svg
                        viewBox="0 0 24 24"
                        {...commonProps}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M5 12L10 17L19 8"
                            {...pathProps}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            );
        case 'error':
            return (
                <span className='icon-type'>
                    <svg
                        viewBox="0 0 24 24"
                        {...commonProps}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <line x1="12" y1="8" x2="12" y2="16" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
                        <line x1="12" y1="16" x2="12" y2="8" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </span>
            );
        case 'info':
            return (
                <span className='icon-type'>
                    <svg
                        viewBox="0 0 24 24"
                        {...commonProps}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <line x1="12" y1="8" x2="12" y2="12" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
                        <line x1="12" y1="16" x2="12" y2="16" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </span>
            );
        case 'task':
            return (
                <span className='icon-type'>
                    <svg
                        viewBox="0 0 24 24"
                        {...commonProps}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M6 12l4 4 8-8" stroke={strokeColor} stroke-width="2" fill="none" />
                    </svg>
                </span>
            );
        case 'leaderboard':
            return (
                <span className='icon-type'>
                    <svg
                        viewBox="0 0 24 24"
                        {...commonProps}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect x="5" y="14" width="4" height="6" fill="white" />
                        <rect x="10" y="10" width="4" height="10" fill="white" />
                        <rect x="15" y="6" width="4" height="14" fill="white" />
                    </svg>
                </span>
            );
        case 'frens':
            return (
                <span className='icon-type'>
                    <svg
                        {...commonProps}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <symbol id="icon-person" viewBox="0 0 24 24">
                            <circle cx="12" cy="8" r="4" fill="white" />
                            <path d="M7,13 Q12,16 17,13" stroke="white" stroke-width="2" fill="none" />
                        </symbol>
                        <use href="#icon-person" x="-5" y="-2" width="24" height="24" />
                        <use href="#icon-person" x="5" y="7" width="24" height="24" />
                    </svg>
                </span>
            );
        default:
            return null;
    }
};

export default IconType;
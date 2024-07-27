import React from 'react';
import './iconType.scss';

// Определяем типы для поддерживаемых иконок
type IconType = 'arrow-left' | 'arrow-right' | 'checkmark' | 'error' | 'info';

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
                        <path
                            d="M12 2L2 22h20L12 2z" // Треугольник (восклицательный знак)
                            {...pathProps}
                            fill="none" // Заполнение треугольника
                        />
                        <path
                            d="M12 16v-4"
                            {...pathProps}
                            strokeLinecap="round"
                        />
                        <path
                            d="M12 14h0"
                            {...pathProps}
                            strokeLinecap="round"
                        />
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
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" // Окружность
                            {...pathProps}
                            fill="none" // Оставляем без заполнения
                        />
                        <path
                            d="M12 16h0"
                            {...pathProps}
                            strokeLinecap="round"
                        />
                        <path
                            d="M12 8v4"
                            {...pathProps}
                            strokeLinecap="round"
                        />
                    </svg>
                </span>
            );
        default:
            return null;
    }
};

export default IconType;
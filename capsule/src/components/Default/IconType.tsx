import React from 'react';
import './iconType.scss';

// Определяем типы для поддерживаемых иконок
type IconType = 'arrow-left' | 'arrow-right' | 'checkmark' | 'error' | 'info' | 'task' | 'leaderboard' | 'frens' | 'connect';

// Определяем пропсы компонента иконок
interface IconProps extends React.SVGProps<SVGSVGElement> {
    type: IconType;
    size?: number | string; // Поддержка размера иконки
    color?: string; // Поддержка цвета
    strokeColor?: string;
    border?: boolean;
    sizeFill?: number | string;
    onClick?: React.MouseEventHandler<SVGSVGElement>; // Поддержка обработчика клика
}

// Компонент иконок
const IconType: React.FC<IconProps> = ({ type, size = 20, sizeFill = 36, strokeColor = '#CF00F8', border = true, color = 'none', onClick, ...props }) => {
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

    const style = {
        width: typeof sizeFill === 'number' ? `${sizeFill}px` : sizeFill,
        height: typeof sizeFill === 'number' ? `${sizeFill}px` : sizeFill,
    };

    const css = border ? "icon-type icon-border" : "icon-type";

    switch (type) {
        case 'arrow-left':
            return (
                <span className={css} style={style}>
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
                <span className={css} style={style}>
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
                <span className={css} style={style}>
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
                <span className={css} style={style}>
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
                <span className={css} style={style}>
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
                <span className={css} style={style}>
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
                <span className={css} style={style}>
                    <svg
                        viewBox="0 0 24 24"
                        {...commonProps}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect x="6" y="12" width="2" height="5" fill="white" />
                        <rect x="11" y="7" width="2" height="10" fill="white" />
                        <rect x="16" y="10" width="2" height="7" fill="white" />
                    </svg>
                </span>
            );
        case 'frens':
            return (
                <span className={css} style={style}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 64 64"
                        {...commonProps}
                    >
                        <circle cx="28" cy="25" r="5" fill="none" stroke-width="4" stroke="currentColor" />
                        <path d="M19 45a9 9 0 0118 0" fill="none" stroke="currentColor" stroke-width="4" />
                        <path d="M43 29v10m-5-5h10" stroke-width="2" stroke="currentColor" fill="none" />
                    </svg>
                </span>
            );
        case 'connect':
            return (
                <span className={css} style={style}>
                    <svg {...commonProps} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z" fill="#0098EA" />
                        <path d="M37.5603 15.6277H18.4386C14.9228 15.6277 12.6944 19.4202 14.4632 22.4861L26.2644 42.9409C27.0345 44.2765 28.9644 44.2765 29.7345 42.9409L41.5381 22.4861C43.3045 19.4251 41.0761 15.6277 37.5627 15.6277H37.5603ZM26.2548 36.8068L23.6847 31.8327L17.4833 20.7414C17.0742 20.0315 17.5795 19.1218 18.4362 19.1218H26.2524V36.8092L26.2548 36.8068ZM38.5108 20.739L32.3118 31.8351L29.7417 36.8068V19.1194H37.5579C38.4146 19.1194 38.9199 20.0291 38.5108 20.739Z" fill="white" />
                    </svg>
                </span>
            );
        default:
            return null;
    }
};

export default IconType;
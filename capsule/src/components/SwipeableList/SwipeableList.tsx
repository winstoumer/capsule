import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Default/Button';
import './SwipeableList.scss';
import IconType from '../Default/IconType';

interface Item {
    logo: string | JSX.Element;
    buttonText: string;
    link: string;
    comingSoon?: boolean;
}

interface SwipeableListProps {
    items: Item[];
}

const SwipeableList: React.FC<SwipeableListProps> = ({ items }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    let startX: number | null = null;
    let currentX = 0;
    let deltaX = 0;
    let slideWidth = 0;

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        startX = e.touches[0].clientX;
        slideWidth = containerRef.current?.getBoundingClientRect().width || 0;
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (startX !== null && containerRef.current) {
            const touch = e.touches[0];
            const distX = touch.clientX - startX;
            currentX = Math.max(-slideWidth, Math.min(0, distX));
            containerRef.current.style.transform = `translateX(${currentX}px)`;
            deltaX = Math.sign(distX);
    
            if (Math.abs(distX) > Math.abs(touch.clientY - startX!)) {
                e.preventDefault();
            }
        }
    };       

    const handleTouchEnd = () => {
        if (deltaX < 0) {
            slideNext();
        } else if (deltaX > 0) {
            slidePrev();
        }
        startX = null;
        deltaX = 0;
    };

    const slideNext = () => {
        if (containerRef.current) {
            containerRef.current.style.transition = 'transform 0.3s ease-in-out';
            containerRef.current.style.transform = `translateX(-${slideWidth}px)`;
            setTimeout(() => {
                if (containerRef.current) {
                    containerRef.current.appendChild(containerRef.current.firstElementChild!);
                    containerRef.current.style.transition = 'none';
                    containerRef.current.style.transform = `translateX(0)`;
                    setActiveIndex((prev) => (prev + 1) % items.length);
                }
            }, 300);
        }
    };

    const slidePrev = () => {
        if (containerRef.current) {
            containerRef.current.insertBefore(containerRef.current.lastElementChild!, containerRef.current.firstChild);
            containerRef.current.style.transition = 'none';
            containerRef.current.style.transform = `translateX(-${slideWidth}px)`;
            setTimeout(() => {
                if (containerRef.current) {
                    containerRef.current.style.transition = 'transform 0.3s ease-in-out';
                    containerRef.current.style.transform = `translateX(0)`;
                    setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
                }
            }, 10);
        }
    };

    const handleClick = (link: string) => {
        const contentElement = document.querySelector('.content');

        if (contentElement) {
            contentElement.classList.add('slideDown');
            setTimeout(() => {
                navigate(link);
            }, 200);
        } else {
            navigate(link);
        }
    };

    const handleEmpty = () => {
        return;
    }

    return (
        <div className="swipeable-list-container">
            <div
                className="swipeable-list"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    overflow: 'hidden',
                    position: 'relative',
                    width: '100%',
                    maxWidth: '100vw',
                }}
            >
                <div className="arrow arrow-left">
                    <IconType type='arrow-left' onClick={slidePrev} />
                </div>
                <div
                    ref={containerRef}
                    style={{
                        display: 'flex',
                        transition: 'transform 0.3s ease-in-out',
                    }}
                >
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="swipeable-list-item"
                            style={{
                                flex: '0 0 auto',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                textAlign: 'center',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {typeof item.logo === 'string' ? (
                                <img src={item.logo} alt={`logo-${index}`} className="item-logo" style={{ maxWidth: '100%' }} />
                            ) : (
                                <div className="item-logo">{item.logo}</div>
                            )}
                            {item.comingSoon ? (
                                <Button text="COMING SOON" onClick={() => handleEmpty()} />
                            ) : (
                                <Button text={item.buttonText} onClick={() => handleClick(item.link)} />
                            )}
                        </div>
                    ))}
                </div>
                <div className="arrow arrow-right">
                    <IconType type='arrow-right' onClick={slideNext} />
                </div>
                <div className="indicators">
                    {items.map((_, index) => (
                        <div
                            key={index}
                            className={`indicator ${index === activeIndex ? 'active-indicator' : ''}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SwipeableList;


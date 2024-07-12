import React, { useRef } from 'react';
import './SwipeableList.scss';
import Button from '../Default/Button';

interface Item {
  logo: string | JSX.Element;
  buttonText: string;
}

interface SwipeableListProps {
  items: Item[];
}

const SwipeableList: React.FC<SwipeableListProps> = ({ items }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  let startX: number | null = null;
  let currentX = 0;
  let deltaX = 0;
  let slideWidth = 0;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    startX = e.touches[0].clientX;
    slideWidth = containerRef.current?.getBoundingClientRect().width || 0;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (startX !== null && containerRef.current && screenRef.current) {
      const touch = e.touches[0];
      const distX = touch.clientX - startX;
      currentX = Math.min(0, Math.max(-slideWidth, distX)); // ограничение свайпа
      containerRef.current.style.transform = `translateX(${currentX}px)`;
      deltaX = Math.sign(distX);
    }
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    if (deltaX < 0) {
      // Swipe left
      slideNext();
    } else if (deltaX > 0) {
      // Swipe right
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
        }
      }, 300);
    }
  };

  const slidePrev = () => {
    if (containerRef.current) {
      containerRef.current.style.transition = 'transform 0.3s ease-in-out';
      containerRef.current.insertBefore(containerRef.current.lastElementChild!, containerRef.current.firstChild);
      containerRef.current.style.transform = `translateX(-${slideWidth}px)`;
      setTimeout(() => {
        containerRef.current!.style.transition = 'none';
        containerRef.current!.style.transform = `translateX(0)`;
      }, 50);
    }
  };

  const handleClick = () => {
    // Handle button click logic
  };

  return (
    <div className="swipeable-list-container">
      <div
        ref={screenRef}
        className="swipeable-list-screen"
      >
        <div
          ref={containerRef}
          className="swipeable-list"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {items.map((item, index) => (
            <div key={index} className="swipeable-list-item">
              {typeof item.logo === 'string' ? (
                <img src={item.logo} alt={`logo-${index}`} className="item-logo" />
              ) : (
                <div className="item-logo">{item.logo}</div>
              )}
              <Button text={item.buttonText} onClick={handleClick} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SwipeableList;

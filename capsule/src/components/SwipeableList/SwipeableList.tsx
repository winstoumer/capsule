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
  let startX: number | null = null;
  let currentX = 0;
  let deltaX = 0;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    startX = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (startX !== null) {
      const touch = e.touches[0];
      const distX = touch.clientX - startX;
      currentX = distX; // Используем currentX здесь для установки значения
      deltaX = Math.sign(distX);
      if (containerRef.current) {
        containerRef.current.style.transform = `translateX(${distX}px)`;
      }
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
      containerRef.current.style.transform = `translateX(-100%)`;
      setTimeout(() => {
        containerRef.current!.appendChild(containerRef.current!.firstElementChild!);
        containerRef.current!.style.transition = 'none';
        containerRef.current!.style.transform = `translateX(0)`;
      }, 300);
    }
  };

  const slidePrev = () => {
    if (containerRef.current) {
      containerRef.current.insertBefore(containerRef.current.lastElementChild!, containerRef.current.firstChild);
      containerRef.current.style.transition = 'none';
      containerRef.current.style.transform = `translateX(-100%)`;
      setTimeout(() => {
        containerRef.current!.style.transition = 'transform 0.3s ease-in-out';
        containerRef.current!.style.transform = `translateX(0)`;
      }, 50);
    }
  };

  const hClick = () => {
    return;
  }

  return (
    <div className="swipeable-list-container">
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
            <Button text={item.buttonText} onClick={hClick} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SwipeableList;

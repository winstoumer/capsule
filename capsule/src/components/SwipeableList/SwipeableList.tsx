import React, { ReactNode } from 'react';
import './SwipeableList.scss';
import Button from '../Default/Button';

interface Item {
    logo: string | ReactNode;
    buttonText: string;
}

interface SwipeableListProps {
    items: Item[];
}

const SwipeableList: React.FC<SwipeableListProps> = ({ items }) => {

    const hClick = () => {
        return;
    }

    return (
        <div className="swipeable-list-container">
            <div className="swipeable-list">
                {items.map((item, index) => (
                    <div className="swipeable-list-item" key={index}>
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

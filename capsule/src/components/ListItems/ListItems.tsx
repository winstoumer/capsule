import './listItems.scss';
import React, { useState } from 'react';

interface Item {
    icon: string;
    name: string;
    price?: number;
    mark?: string | number;
    i?: string;
    description?: string;
}

interface ListItemsProps {
    items: Item[];
    isBordered: boolean;
}

const ListItems: React.FC<ListItemsProps> = ({ items, isBordered }) => {
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [isExiting, setIsExiting] = useState<boolean>(false);

    const handleItemClick = (item: Item) => {
        setSelectedItem(item);
        setIsExiting(false);
    };

    const closeModal = () => {
        setIsExiting(true);
        setTimeout(() => {
            setSelectedItem(null);
        }, 300); // Duration of the slide out animation
    };

    return (
        <div className={`list ${isBordered ? 'bordered' : ''}`}>
            {items.map((item, index) => (
                <div className='item' key={index} onClick={() => handleItemClick(item)}>
                    <div className='icon'>
                        {item.icon}
                    </div>
                    <div className='info'>
                        <div className='name'>{item.name}</div>
                        <div className='description'>
                            {item.price !== undefined && <div className='price'>{item.price}</div>}
                            {item.mark !== undefined && item.i !== undefined && <div className='mark'>{item.mark} {item.i}</div>}
                        </div>
                    </div>
                </div>
            ))}

            {selectedItem && (
                <Modal item={selectedItem} onClose={closeModal} isExiting={isExiting} />
            )}
        </div>
    );
};

interface ModalProps {
    item: Item;
    onClose: () => void;
    isExiting: boolean;
}

const Modal: React.FC<ModalProps> = ({ item, onClose, isExiting }) => {
    return (
        <div className={`modal ${isExiting ? 'modal-exit' : ''}`}>
            <div className='modal-content'>
                <span className='close' onClick={onClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6 6L18 18" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </span>
                <div className='modal-icon'>{item.icon}</div>
                <div className='modal-name'>{item.name}</div>
                <div className='modal-info'>
                    {item.mark !== undefined && item.i !== undefined && <div className='modal-mark'>{item.mark} {item.i}</div>}
                    {item.description !== undefined && <div className='modal-description'>{item.description}</div>}
                    {item.price !== undefined && <div className='modal-price'>{item.price}</div>}
                </div>
                <button className='default-button'>Up</button>
            </div>
        </div>
    );
};

export default ListItems;

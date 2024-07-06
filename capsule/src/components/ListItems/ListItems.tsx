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

    const handleItemClick = (item: Item) => {
        setSelectedItem(item);
    };

    const closeModal = () => {
        setSelectedItem(null);
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
                <Modal item={selectedItem} onClose={closeModal} />
            )}
        </div>
    );
};

interface ModalProps {
    item: Item;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ item, onClose }) => {
    return (
        <div className='modal'>
            <div className='modal-content'>
                <span className='close' onClick={onClose}>&times;</span>
                <div className='modal-icon'>{item.icon}</div>
                <div className='modal-name'>{item.name}</div>
                <div className='modal-info'>
                    {item.description !== undefined && <div className='modal-description'>{item.description}</div>}
                    {item.mark !== undefined && item.i !== undefined && <div className='modal-mark'>{item.mark} {item.i}</div>}
                    {item.price !== undefined && <div className='modal-price'>{item.price}</div>}
                </div>
                <button className='default-button'>Up</button>
            </div>
        </div>
    );
};

export default ListItems;

import './listItems.scss';
import React from 'react';

interface Item {
    icon: string;
    name: string;
    price?: number;
    mark?: string | number;
    i?: string;
}

interface ListItemsProps {
    items: Item[];
}

const ListItems: React.FC<ListItemsProps> = ({ items }) => {
    return (
        <div className='list'>
            {items.map((item, index) => (
                <div className='item' key={index}>
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
        </div>
    );
};

export default ListItems;

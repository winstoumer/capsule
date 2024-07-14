import React, { ReactNode } from 'react';
import './List.scss';

interface ItemListProps {
    children: ReactNode;
}

const List: React.FC<ItemListProps> = ({ children }) => {
    return (
        <div className='items'>
            {children}
        </div>
    );
};

export default List;

import React, { ReactNode } from 'react';
import './List.scss';

interface ListProps {
    children: ReactNode;
}

interface ItemProps {
    children: ReactNode;
    key: number;
}

interface ItemChildProps {
    children: ReactNode;
}

const List: React.FC<ListProps> = ({ children }) => {
    return (
        <div className='items'>
            {children}
        </div>
    );
};

const Item: React.FC<ItemProps> = ({ children }) => {
    return (
        <div className='item-container'>
            {children}
        </div>
    );
};

const Icon: React.FC<ItemChildProps> = ({ children }) => (
    <div className='item-wrapper-icon'>
        {children}
    </div>
);

const Title: React.FC<ItemChildProps> = ({ children }) => (
    <div className='item-title'>
        {children}
    </div>
);

const Subtitle: React.FC<ItemChildProps> = ({ children }) => (
    <div className='item-subtitle'>
        {children}
    </div>
);

const Right: React.FC<ItemChildProps> = ({ children }) => (
    <div className='item-right-container'>
        {children}
    </div>
);

export { List, Item, Icon, Title, Subtitle, Right };

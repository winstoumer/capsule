import { ReactNode } from 'react';
import './balance.scss';

interface Props {
    children: ReactNode;
}

const Balance: React.FC<Props> = ({ children }) => {

    return <div className='balance'>{children}</div>;
};

export default Balance;
// src/pages/Earn.tsx
import './earn.scss';
import React from 'react';
import { Navigation } from "../components/Navigation/Navigation";
import Tab from '../components/Tab/Tab';

const Earn: React.FC = () => {

    return (
        <div className='content'>
            <Tab
                tabs={[
                    { title: 'Earn', content: <div>Содержимое для вкладки 1</div> },
                    { title: 'Referral', content: <div>Содержимое для вкладки 2</div> },
                ]}
            />
            <Navigation />
        </div>
    );
}

export default Earn;
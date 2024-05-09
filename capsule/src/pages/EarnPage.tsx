// src/pages/EarnPage.tsx
import './earn.scss';
import React from 'react';
import Tab from '../components/Tab/Tab';
import { Navigation } from "../components/Navigation/Navigation";
import { Earn } from "../components/Earn/Earn";
import { Referral } from "../components/Referral/Referral";

const EarnPage: React.FC = () => {

    return (
        <div className='content'>
            <Tab
                tabs={[
                    { title: 'Earn', content: <Earn /> },
                    { title: 'Referral', content: <Referral /> },
                ]}
            />
            <Navigation />
        </div>
    );
}

export default EarnPage;
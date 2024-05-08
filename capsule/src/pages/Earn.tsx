// src/pages/Earn.tsx
import './earn.scss';
import React from 'react';
import Tab from '../components/Tab/Tab';
import { Navigation } from "../components/Navigation/Navigation";
import { EarnComponent } from "../components/Earn/EarnComponent";
import { ReferralComponent } from "../components/Referral/ReferralComponent";

const Earn: React.FC = () => {

    return (
        <div className='content'>
            <Tab
                tabs={[
                    { title: 'Earn', content: <EarnComponent /> },
                    { title: 'Referral', content: <ReferralComponent /> },
                ]}
            />
            <Navigation />
        </div>
    );
}

export default Earn;
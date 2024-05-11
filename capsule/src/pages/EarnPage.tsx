// src/pages/EarnPage.tsx
import './earn.scss';
import React from 'react';
import Tab from '../components/Tab/Tab';
import { Navigation } from "../components/Navigation/Navigation";
import { Earn } from "../components/Earn/Earn";
import { Referral } from "../components/Referral/Referral";
import PageComponent from '../components/PageComponent/PageComponent';

const EarnPage: React.FC = () => {

    return (
        <div className='content'>
            <PageComponent>
                <Tab
                    tabs={[
                        { title: 'Earn', content: <Earn /> },
                        { title: 'Referral', content: <Referral /> },
                    ]}
                />
                <Navigation />
            </PageComponent>
        </div>
    );
}

export default EarnPage;
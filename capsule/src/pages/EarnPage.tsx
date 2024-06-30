// src/pages/EarnPage.tsx
import './earn.scss';
import React from 'react';
import Tab from '../components/Tab/Tab';
import { Earn } from "../components/Earn/Earn";
import { Referral } from "../components/Referral/Referral";
import PageComponent from '../components/PageComponent/PageComponent';

const EarnPage: React.FC = () => {
    return (
        <PageComponent navigation={true}>
            <Tab
                tabs={[
                    { title: 'Earn', content: <Earn />, image: '💸' },
                    { title: 'Referral', content: <Referral />, image: '🤝' }
                ]}
            />
        </PageComponent>
    );
}

export default EarnPage;
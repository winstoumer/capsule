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
        <PageComponent>
            <Tab
                tabs={[
                    { title: 'Earn', content: <Earn />, image: '/invite.jpg' },
                    { title: 'Referral', content: <Referral />, image: '/invite.jpg' }
                ]}
            />
            <Navigation />
        </PageComponent>
    );
}

export default EarnPage;
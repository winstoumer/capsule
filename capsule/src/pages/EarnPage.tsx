// src/pages/EarnPage.tsx
import './earn.scss';
import React from 'react';
import Tab from '../components/Tab/Tab';
import { Earn } from "../components/Earn/Earn";
import { Referral } from "../components/Referral/Referral";
import PageComponent from '../components/PageComponent/PageComponent';
import StarryNightBackground from '../components/Background/StarryNightBackground';

const EarnPage: React.FC = () => {
    return (
        <PageComponent navigation={true}>
            <Tab
                tabs={[
                    { title: 'Earn', content: <Earn />, image: '💸' },
                    { title: 'Referral', content: <Referral />, image: '🤝' }
                ]}
            />
            <StarryNightBackground maxStars={14} />
        </PageComponent>
    );
}

export default EarnPage;
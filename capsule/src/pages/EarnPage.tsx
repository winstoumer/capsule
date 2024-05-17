// src/pages/EarnPage.tsx
import './earn.scss';
import React from 'react';
import Tab from '../components/Tab/Tab';
import { Navigation } from "../components/Navigation/Navigation";
import { Earn } from "../components/Earn/Earn";
import { Referral } from "../components/Referral/Referral";
import PageComponent from '../components/PageComponent/PageComponent';
import ProcessNft from '../components/ProcessNft/ProcessNft';

const EarnPage: React.FC = () => {

    const date = new Date("2024-05-17 10:00:00");

    return (
        <div className='content'>
            <PageComponent>
                <Tab
                    tabs={[
                        { title: 'Earn', content: <Earn /> },
                        { title: 'Referral', content: <Referral /> },
                        { title: 'Nft', content: <ProcessNft startDate={date} /> }
                    ]}
                />
                <Navigation />
            </PageComponent>
        </div>
    );
}

export default EarnPage;
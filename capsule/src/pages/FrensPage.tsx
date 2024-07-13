// src/pages/FrensPage.tsx
import './frens.scss';
import React from 'react';
import { Referral } from "../components/Referral/Referral";
import PageComponent from '../components/PageComponent/PageComponent';
import StarryNightBackground from '../components/Background/StarryNightBackground';

const FrensPage: React.FC = () => {
    return (
        <PageComponent>
            <Referral />
            <StarryNightBackground maxStars={14} />
        </PageComponent>
    );
}

export default FrensPage;
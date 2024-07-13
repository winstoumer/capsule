// src/pages/EarnPage.tsx
import './earn.scss';
import React from 'react';
import { Earn } from "../components/Earn/Earn";
import PageComponent from '../components/PageComponent/PageComponent';
import StarryNightBackground from '../components/Background/StarryNightBackground';

const EarnPage: React.FC = () => {
    return (
        <PageComponent title='Tasks'>
            <Earn />
            <StarryNightBackground maxStars={14} />
        </PageComponent>
    );
}

export default EarnPage;
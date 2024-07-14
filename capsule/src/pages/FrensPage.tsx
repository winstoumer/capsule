// src/pages/FrensPage.tsx
import './frens.scss';
import React from 'react';
import { Referral } from "../components/Referral/Referral";
import PageComponent from '../components/PageComponent/PageComponent';

const FrensPage: React.FC = () => {
    return (
        <PageComponent title='Frens'>
            <Referral />
        </PageComponent>
    );
}

export default FrensPage;
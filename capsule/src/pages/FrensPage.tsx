// src/pages/FrensPage.tsx
import './frens.scss';
import React from 'react';
import { Referral } from "../components/Referral/Referral";
import PageComponent from '../components/PageComponent/PageComponent';

const FrensPage: React.FC = () => {
    return (
        <PageComponent title='Frens'>
            <div className='subtitle'>
                For each invitee +50 P.
            </div>
            <Referral />
        </PageComponent>
    );
}

export default FrensPage;
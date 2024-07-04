// src/pages/EarnPage.tsx
import './boostGame.scss';
import React from 'react';
import PageComponent from '../components/PageComponent/PageComponent';
import Boost from '../components/Game/Boost';

const BoostGamePage: React.FC = () => {
    return (
        <PageComponent title='Boost'>
            <Boost></Boost>
        </PageComponent>
    );
}

export default BoostGamePage;
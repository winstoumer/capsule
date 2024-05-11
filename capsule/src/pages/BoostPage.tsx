// src/pages/BoostPage.tsx
import './boost.scss';
import React from 'react';
import { Navigation } from "../components/Navigation/Navigation";
import { Boost } from "../components/Boost/Boost";
import PageComponent from '../components/PageComponent/PageComponent';
import PlanetAnimation from '../components/Planet/Planet';

const BoostPage: React.FC = () => {

    return (
        <div className='content'>
            <PageComponent>
                <Boost />
                <Navigation />
            </PageComponent>
            <PlanetAnimation />
        </div>
    );
}

export default BoostPage;
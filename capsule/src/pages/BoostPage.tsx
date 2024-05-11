// src/pages/BoostPage.tsx
import './boost.scss';
import React from 'react';
import { Navigation } from "../components/Navigation/Navigation";
import { Boost } from "../components/Boost/Boost";
import PageComponent from '../components/PageComponent/PageComponent';

const BoostPage: React.FC = () => {

    return (
        <div className='content'>
            <PageComponent>
                <Boost />
                <Navigation />
            </PageComponent>
        </div>
    );
}

export default BoostPage;
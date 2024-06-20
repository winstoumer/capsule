// src/pages/BoostPage.tsx
import './boost.scss';
import React from 'react';
//import { Navigation } from "../components/Navigation/Navigation";
import { Boost } from "../components/Boost/Boost";
import PageComponent from '../components/PageComponent/PageComponent';

const BoostPage: React.FC = () => {

    return (
        <PageComponent>
            <Boost />
        </PageComponent>
    );
}

export default BoostPage;
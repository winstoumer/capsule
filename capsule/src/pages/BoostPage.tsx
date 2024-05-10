// src/pages/BoostPage.tsx
import './boost.scss';
import React from 'react';
import { Navigation } from "../components/Navigation/Navigation";
import { Boost } from "../components/Boost/Boost";

const BoostPage: React.FC = () => {

    return (
        <div className='content'>
            <Boost />
            <Navigation />
        </div>
    );
}

export default BoostPage;
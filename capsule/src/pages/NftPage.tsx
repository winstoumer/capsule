// src/pages/NftPage.tsx
import './nft.scss';
import React from 'react';
import { Navigation } from "../components/Navigation/Navigation";
import { Nft } from "../components/Nft/Nft";
import PageComponent from '../components/PageComponent/PageComponent';

const NftPage: React.FC = () => {

    return (
        <div className='content'>
            <PageComponent>
                <Nft />
                <Navigation />
            </PageComponent>
        </div>
    );
}

export default NftPage;
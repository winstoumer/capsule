// src/pages/NftPage.tsx
import './nft.scss';
import React from 'react';
import { Navigation } from "../components/Navigation/Navigation";
import { Nft } from "../components/Nft/Nft";

const NftPage: React.FC = () => {

    return (
        <div className='content'>
            <Nft />
            <Navigation />
        </div>
    );
}

export default NftPage;
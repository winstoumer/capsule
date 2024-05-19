// src/pages/NftPage.tsx
import './nft.scss';
import React from 'react';
import { Navigation } from "../components/Navigation/Navigation";
import CollectionList from "../components/Nft/CollectionList";
import PageComponent from '../components/PageComponent/PageComponent';

const NftPage: React.FC = () => {

    return (
        <div className='content'>
            <PageComponent>
                <CollectionList />
                <Navigation />
            </PageComponent>
        </div>
    );
}

export default NftPage;
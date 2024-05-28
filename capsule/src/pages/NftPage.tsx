// src/pages/NftPage.tsx
import './nft.scss';
import React from 'react';
import { Navigation } from "../components/Navigation/Navigation";
import CollectionList from "../components/Nft/CollectionList";
import PageComponent from '../components/PageComponent/PageComponent';

const NftPage: React.FC = () => {

    return (
        <PageComponent>
            <CollectionList />
            <Navigation />
        </PageComponent>
    );
}

export default NftPage;
// src/pages/CollectionPage.tsx
import './nft.scss';
import React from 'react';
import PageComponent from '../components/PageComponent/PageComponent';
import CollectionList from "../components/CollectionList/CollectionList";
import { Navigation } from "../components/Navigation/Navigation";

const CollectionPage: React.FC = () => {

    return (
        <PageComponent>
            <CollectionList />
            <Navigation />
        </PageComponent>
    );
}

export default CollectionPage;
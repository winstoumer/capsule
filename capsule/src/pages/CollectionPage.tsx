// src/pages/CollectionPage.tsx
import './nft.scss';
import React from 'react';
import PageComponent from '../components/PageComponent/PageComponent';
import CollectionList from "../components/CollectionList/CollectionList";

const CollectionPage: React.FC = () => {

    return (
        <PageComponent>
            <CollectionList />
        </PageComponent>
    );
}

export default CollectionPage;
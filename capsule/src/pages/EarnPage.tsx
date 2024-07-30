// src/pages/EarnPage.tsx
import './earn.scss';
import React from 'react';
import { Earn } from "../components/Earn/Earn";
import PageComponent from '../components/PageComponent/PageComponent';

const EarnPage: React.FC = () => {
    return (
        <PageComponent title='Tasks' padding={true}>
            <Earn />
        </PageComponent>
    );
}

export default EarnPage;
import './home.scss';
import React from 'react';
import PageComponent from '../components/PageComponent/PageComponent';
import { ActiveTime } from "../components/ActiveTime/ActiveTime";

const MiningPage: React.FC = () => {

    return (
        <PageComponent title='Mining'>
            <ActiveTime />
        </PageComponent>
    );
}

export default MiningPage;
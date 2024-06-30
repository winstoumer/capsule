import './home.scss';
import React from 'react';
import PageComponent from '../components/PageComponent/PageComponent';
import { ActiveTime } from "../components/ActiveTime/ActiveTime";

const MiningPage: React.FC = () => {

  return (
    <PageComponent>
      <div className='general'>
        <ActiveTime />
      </div>
    </PageComponent>
  );
}

export default MiningPage;
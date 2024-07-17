import './home.scss';
import React from 'react';
import PageComponent from '../components/PageComponent/PageComponent';
import { LeaderBoard } from '../components/Game/LeaderBoard';

const LeaderboardPage: React.FC = () => {

  return (
    <PageComponent title='Leaderboard'>
      <LeaderBoard />
    </PageComponent>
  );
}

export default LeaderboardPage;
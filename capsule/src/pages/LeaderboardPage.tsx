import './home.scss';
import React from 'react';
import PageComponent from '../components/PageComponent/PageComponent';
import { LeaderBoard } from '../components/Game/LeaderBoard';

const LeaderboardPage: React.FC = () => {

  return (
    <PageComponent
      title='Leaderboard'
      subtitle='Updated every 7 days.'
    >
      <LeaderBoard />
    </PageComponent>
  );
}

export default LeaderboardPage;
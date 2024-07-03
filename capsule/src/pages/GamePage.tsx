import './game.scss';
import React from 'react';
import PageComponent from '../components/PageComponent/PageComponent';
import Game from '../components/Game/Game';

const GamePage: React.FC = () => {

  return (
    <PageComponent>
        <Game />
    </PageComponent>
  );
}

export default GamePage;
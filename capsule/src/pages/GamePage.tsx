import './game.scss';
import React from 'react';
import PageComponent from '../components/PageComponent/PageComponent';
import Game from '../components/Game/Game';

const GamePage: React.FC = () => {

  return (
    <PageComponent>
      <Game
        duration={30}
        coinsPerClick={0.1}
        maxTouches={1}
      />
    </PageComponent>
  );
}

export default GamePage;
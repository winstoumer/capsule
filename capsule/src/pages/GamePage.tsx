import './game.scss';
import React from 'react';
import PageComponent from '../components/PageComponent/PageComponent';
import Game from '../components/Game/Game';
import { PortalProvider } from '../components/PortalContext/PortalContext';

const GamePage: React.FC = () => {

  return (
    <PortalProvider>
      <PageComponent>
        <Game
          duration={30}
          coinsPerClick={1}
          maxTouches={3}
          multiplier={false}
        />
      </PageComponent>
    </PortalProvider>
  );
}

export default GamePage;
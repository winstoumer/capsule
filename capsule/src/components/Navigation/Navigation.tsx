import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './navigation.scss';

export const Navigation = () => {
  useEffect(() => {
    const nftLink = document.querySelector('.color-nft a');
    if (nftLink instanceof HTMLElement) {
      setTimeout(() => {
        nftLink.style.animation = 'activeNft 2.4s ease infinite';
      }, 500); // Задержка в 500 миллисекунд (0.5 секунды)
    }
  }, []);

  return (
    <div className='bottom-navigation'>
      <div className='navigation'>
        <div className="nav-b">
          <Link to="/">Matter</Link>
        </div>
        <div className="nav-b">
          <Link to="/boost">Boost</Link>
        </div>
        <div className="nav-b">
          <Link to="/earn">Earn</Link>
        </div>
        <div className="nav-b color-nft">
          <Link to="/collections">Nft</Link>
        </div>
      </div>
    </div>
  );
};

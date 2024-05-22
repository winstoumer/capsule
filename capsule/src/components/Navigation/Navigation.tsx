import { useEffect } from 'react';
import './navigation.scss';
import { Link } from 'react-router-dom';

export const Navigation = () => {
  useEffect(() => {
    const nftLink = document.querySelector('.color-nft a');
    if (nftLink instanceof HTMLElement) {
      nftLink.style.animation = 'activeNft 2.4s ease infinite';
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
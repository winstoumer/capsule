import { Link } from 'react-router-dom';
import './navigation.scss';

export const Navigation = () => {

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
        <div className="nav-b">
          <Link className='color-nft' to="/collections">Nft</Link>
        </div>
      </div>
    </div>
  );
};

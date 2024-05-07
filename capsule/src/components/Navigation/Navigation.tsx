import './navigation.scss';
import { Link } from 'react-router-dom';

export const Navigation = () => {

    return <div className='bottom-navigation'>
        <div className='navigation'>
            <div className="nav-b">
                <Link to="/">Capsule</Link>
            </div>
            <div className="nav-b">
                <Link to="/">Earn</Link>
            </div>
            <div className="nav-b color-nft">
                <Link to="/">Nft</Link>
            </div>
        </div>
    </div>
};
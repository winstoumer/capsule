import './navigation.scss';
import { Link } from 'react-router-dom';

export const Navigation = () => {

    return <div className="bottom-navigation">
        <div className="nav-b">
            <Link to="/">Capsule</Link>
        </div>
    </div>
};
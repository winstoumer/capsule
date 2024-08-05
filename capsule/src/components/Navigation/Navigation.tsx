// navigation.tsx
import 'react';
import { useNavigate } from 'react-router-dom';
import './navigation.scss';
import IconType from '../Default/IconType';
import { navigationForward } from '../utils/handleNavigation';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className='bottom-navigation'>
      <div className='navigation'>
        <div className="nav-b" onClick={() => navigationForward(navigate, '/earn')}>
          <IconType size={34} border={false} type='task' strokeColor='white' />
          Tasks
        </div>
        <div className="nav-b" onClick={() => navigationForward(navigate, '/leaderboard')}>
          <IconType size={34} border={false} type='leaderboard' />
          Leaderboard
        </div>
        <div className="nav-b" onClick={() => navigationForward(navigate, '/frens')}>
          <IconType size={34} border={false} type='frens' />
          Frens
        </div>
      </div>
    </div>
  );
};

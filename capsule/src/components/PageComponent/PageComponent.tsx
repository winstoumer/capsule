import React, { ReactNode } from 'react';
import './pageComponent.scss';
import { Navigation } from '../Navigation/Navigation';

interface PageComponentProps {
  children: ReactNode;
  title?: string;
  navigation?: boolean;
  scroll?: boolean;
}

const PageComponent: React.FC<PageComponentProps> = ({ children, title, navigation = false, scroll = true }) => {
  const containerStyle = {
    justifyContent: navigation ? 'space-between' : 'initial'
  };
  
  const containerClass = scroll ? `content ${scroll ? 'custom-scroll' : ''}` : 'content';

  return (
    <div className={containerClass} style={containerStyle}>
      {title && <div className='page-title'>{title}</div>}
      {children}
      {navigation && <Navigation />}
    </div>
  );
};

export default PageComponent;
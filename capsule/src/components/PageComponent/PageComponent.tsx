import React, { ReactNode } from 'react';
import './pageComponent.scss';
import { Navigation } from '../Navigation/Navigation';

interface PageComponentProps {
  children: ReactNode;
  title?: string;
  navigation?: boolean;
}

const PageComponent: React.FC<PageComponentProps> = ({ children, title, navigation = false }) => {
  const containerStyle = {
    justifyContent: navigation ? 'space-between' : 'initial'
  };

  return (
    <div className='content custom-scroll' style={containerStyle}>
      {title && <div className='page-title'>{title}</div>}
      {children}
      {navigation && <Navigation />}
    </div>
  );
};

export default PageComponent;
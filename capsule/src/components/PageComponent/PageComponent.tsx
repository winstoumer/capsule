import React, { ReactNode } from 'react';
import './pageComponent.scss';
import { Navigation } from '../Navigation/Navigation';

interface PageComponentProps {
  children: ReactNode;
  padding?: boolean; 
  title?: string;
  subtitle?: string;
  navigation?: boolean;
  scroll?: boolean;
}

const PageComponent: React.FC<PageComponentProps> = ({
  children,
  padding = true,
  title,
  subtitle,
  navigation = false,
  scroll = true
}) => {
  const containerStyle = {
    justifyContent: navigation ? 'space-between' : 'initial',
    paddingLeft: padding ? '15px' : '0',
    paddingRight: padding ? '15px' : '0'
  };

  const containerClass = `content ${scroll ? 'custom-scroll' : ''}`;

  return (
    <div className={containerClass} style={containerStyle}>
      {title && <div className='page-title'>{title}</div>}
      {subtitle && <div className='page-subtitle'>{subtitle}</div>}
      {children}
      {navigation && <Navigation />}
    </div>
  );
};

export default PageComponent;

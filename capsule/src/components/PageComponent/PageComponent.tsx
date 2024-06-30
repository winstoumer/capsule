import React, { ReactNode } from 'react';
import './pageComponent.scss';

interface PageComponentProps {
  children: ReactNode;
  title?: string;
}

const PageComponent: React.FC<PageComponentProps> = ({ children, title }) => {
  return (
    <div className='content custom-scroll'>
      {title && <div className='page-title'>{title}</div>}
      <div className='page-content'>
        {children}
      </div>
    </div>
  );
};

export default PageComponent;
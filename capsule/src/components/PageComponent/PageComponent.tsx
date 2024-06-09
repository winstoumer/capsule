import React, { ReactNode } from 'react';

interface PageComponentProps {
  children: ReactNode;
}

const PageComponent: React.FC<PageComponentProps> = ({ children }) => {

  return <div className='content custom-scroll'>{children}</div>;
};

export default PageComponent;

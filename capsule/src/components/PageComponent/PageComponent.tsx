import React, { ReactNode } from 'react';

interface PageComponentProps {
  children: ReactNode;
}

const PageComponent: React.FC<PageComponentProps> = ({ children }) => {

  return <>{children}</>;
};

export default PageComponent;

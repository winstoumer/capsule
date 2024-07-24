import React from 'react';
import { usePortal } from '../PortalContext/PortalContext';
import Loading from '../Loading/Loading';
import './portalGuard.scss';

const PortalGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOpen, error } = usePortal();

  if (error) {
    return <div className='portal-closed subtitle'>Portal is disabled.</div>;
  }

  if (isOpen === null) {
    return <Loading />;
  }

  return (
    <>
      {isOpen ? children : <div className='portal-closed subtitle'>Portal is closed. Access denied.</div>}
    </>
  );
};

export default PortalGuard;
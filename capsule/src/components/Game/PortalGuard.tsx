import React, { useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import './portalGuard.scss';
import Loading from '../Loading/Loading';

interface PortalState {
  isOpen: boolean;
}

interface PortalGuardProps {
  children: ReactNode;
}

const fetchPortalState = async (): Promise<PortalState> => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const response = await axios.get(`${apiUrl}/api/portal-state`);
  return response.data;
};

const PortalGuard: React.FC<PortalGuardProps> = ({ children }) => {
  const [isPortalOpen, setIsPortalOpen] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadPortalState = async () => {
    try {
      const data = await fetchPortalState();
      setIsPortalOpen(data.isOpen);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  useEffect(() => {
    loadPortalState();
  }, []);

  if (error) {
    return <div></div>;
  }

  if (isPortalOpen === null) {
    return <Loading />;
  }

  return (
    <>
      {isPortalOpen ? children : <div className='portal-closed subtitle'>Portal is closed. Access denied.</div>}
    </>
  );
};

export default PortalGuard;

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import axios from 'axios';

interface PortalContextType {
  isOpen: boolean | null;
  error: string | null;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

const fetchPortalState = async (): Promise<{ isOpen: boolean }> => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const response = await axios.get(`${apiUrl}/api/portal-state`);
  return response.data;
};

export const PortalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPortalState = async () => {
      try {
        const data = await fetchPortalState();
        setIsOpen(data.isOpen);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    loadPortalState(); // Initial load

    // Set up interval to refresh the portal state every 10 seconds
    const intervalId = setInterval(loadPortalState, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <PortalContext.Provider value={{ isOpen, error }}>
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (context === undefined) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
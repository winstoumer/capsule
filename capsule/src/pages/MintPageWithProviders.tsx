import React from 'react';
import MintPage from './MintPage';
import { UserProvider } from '../components/UserProvider/UserContext';
import { DataProvider } from '../components/DataProvider/DataContext';

const MintPageWithProviders: React.FC = () => {
    return (
        <UserProvider>
            <DataProvider>
                <MintPage />
            </DataProvider>
        </UserProvider>
    );
};

export default MintPageWithProviders;
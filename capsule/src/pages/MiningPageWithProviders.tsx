import React from 'react';
import { DataProvider } from '../components/DataProvider/DataContext';
import { UserProvider } from '../components/UserProvider/UserContext';
import MiningPage from './MiningPage';

const MiningPageWithProviders: React.FC = () => {
    return (
        <UserProvider>
            <DataProvider>
                <MiningPage />
            </DataProvider>
        </UserProvider>
    );
};

export default MiningPageWithProviders;
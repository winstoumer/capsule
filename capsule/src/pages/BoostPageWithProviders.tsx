import React from 'react';
import BoostPage from './BoostPage';
import { UserProvider } from '../components/UserProvider/UserContext';
import { DataProvider } from '../components/DataProvider/DataContext';

const BoostPageWithProviders: React.FC = () => {
    return (
        <UserProvider>
            <DataProvider>
                <BoostPage />
            </DataProvider>
        </UserProvider>
    );
};

export default BoostPageWithProviders;
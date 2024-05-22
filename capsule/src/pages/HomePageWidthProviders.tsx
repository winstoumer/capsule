import React from 'react';
import { DataProvider } from '../components/DataProvider/DataContext';
import { UserProvider } from '../components/UserProvider/UserContext';
import HomePage from './HomePage';

const HomePageWithProviders: React.FC = () => {
    return (
        <UserProvider>
            <DataProvider>
                <HomePage />
            </DataProvider>
        </UserProvider>
    );
};

export default HomePageWithProviders;
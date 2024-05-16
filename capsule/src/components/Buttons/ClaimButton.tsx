import React from 'react';
import axios from 'axios';

interface UserData {
    id: number;
}

interface Props {
    userData: UserData;
    matterId: number;
    coins: number;
}

const ClaimButton: React.FC<Props> = ({ userData, matterId, coins }) => {
    const updateMining = async (matterId: number): Promise<void> => {
        try {
            await axios.put(`https://capsule-server.onrender.com/api/currentMining/update/${userData.id}`, { matter_id: matterId });
            console.log('Update successful');
        } catch (error) {
            console.error('Error updating mining:', error);
        }
    };

    const updateBalance = async (coins: number): Promise<void> => {
        try {
            await axios.put(`https://capsule-server.onrender.com/api/balance/plus/${userData.id}`, { amount: coins });
            console.log('Update successful');
        } catch (error) {
            console.error('Error updating balance:', error);
        }
    };

    const handleClick = () => {
        updateMining(matterId);
        updateBalance(coins);
    };

    return (
        <button className='default-button' onClick={handleClick}>
            Claim
        </button>
    );
};

export default ClaimButton;
import React from 'react';
import axios from 'axios';

interface Props {
    telegramId: number;
    // Generate Coins
    matterId: number;
    coins: number;
    // Generate Nft
    nftDate: Date | null;
}

const ClaimButton: React.FC<Props> = ({ telegramId, matterId, coins, nftDate }) => {
    const updateMining = async (matterId: number, nftMined: boolean, nftDate: Date | null): Promise<void> => {
        try {
            await axios.put(`https://capsule-server.onrender.com/api/currentMining/update/${telegramId}`,
            { matter_id: matterId, nft_mined: nftMined, time_mined_nft: nftDate });
            console.log('Update successful');
        } catch (error) {
            console.error('Error updating mining:', error);
        }
    };

    const updateBalance = async (coins: number): Promise<void> => {
        try {
            await axios.put(`https://capsule-server.onrender.com/api/balance/plus/${telegramId}`, { amount: coins });
            console.log('Update successful');
        } catch (error) {
            console.error('Error updating balance:', error);
        }
    };

    const handleClick = async () => {
        try {
            if (nftDate) {
                await updateMining(matterId, true, nftDate);
            } else {
                await updateMining(matterId, false, null);
            }
            await updateBalance(coins);
        } catch (error) {
            console.error('Error updating', error);
        }
    };

    return (
        <button className='default-button' onClick={handleClick}>
            Claim
        </button>
    );
};

export default ClaimButton;
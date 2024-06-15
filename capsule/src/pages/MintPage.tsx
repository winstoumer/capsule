import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './mint.scss';
import { v4 as uuidv4 } from 'uuid';
import { SendTransactionRequest, useTonConnectUI, useTonWallet, useTonAddress } from "@tonconnect/ui-react";
import { beginCell } from '@ton/ton';
import { useParams } from 'react-router-dom';
import { useData } from '../components/DataProvider/DataContext';
import PageComponent from '../components/PageComponent/PageComponent';
import Loading from '../components/Loading/Loading';
import HexagonGrid from '../components/Hexagon/HexagonGrid';

interface CollectionData {
    id: number;
    name: string;
    total_nft: number;
    logo_url?: string;
    banner_url?: string;
    date: string;
    active: boolean;
    nft_left: number;
}

const MintPage: React.FC = () => {

    const apiUrl = import.meta.env.VITE_API_URL;

    const { id } = useParams<{ id: string }>();

    const { fetchMiningData, resetMineStates, mintActive: initialMintActive } = useData();
    const [userData, setUserData] = useState<any>(null);
    const [userTonAddress, setUserTonAddress] = useState<string>('');
    const [collection, setCollection] = useState<CollectionData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [nftUuid] = useState<string>(uuidv4());
    const [mintActive, setMintActive] = useState<boolean>(initialMintActive ?? false);

    const userFriendlyAddress = useTonAddress();

    useEffect(() => {
        if (userFriendlyAddress) {
            setUserTonAddress(userFriendlyAddress.toString());
        }
    }, [userFriendlyAddress]);

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            setUserData(window.Telegram.WebApp.initDataUnsafe?.user);
        }
    }, []);

    useEffect(() => {
        if (userData && userData.id) {
            fetchMiningData(userData.id.toString());
        }
    }, [userData, fetchMiningData]);

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                const response = await axios.get<CollectionData>(`${apiUrl}/api/collections/${id}`);
                setCollection(response.data);
            } catch (error) {
                setError('Ошибка при получении данных коллекции');
            } finally {
                setLoading(false);
            }
        };

        fetchCollection();
    }, [id]);

    const updateMining = async (): Promise<void> => {
        try {
            const telegramId = userData.id;
            await axios.put(`${apiUrl}/api/currentMining/minted/${telegramId}`);
            console.log('Update successful');
        } catch (error) {
            console.error('Error updating mining:', error);
        }
    };

    const handleMint = async () => {
        if (!userData || !userTonAddress || !nftUuid || !collection) {
            console.error('Missing required data');
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/api/mint/add`, {
                telegram_id: userData.id,
                address: userTonAddress,
                send_ton: true,
                collection_id: collection.id,
                nft_id: nftUuid,
            });

            if (response.status === 200 || response.status === 201) {
                console.log('Successfully');
                await updateMining();
                setCollection(prevCollection =>
                    prevCollection ? { ...prevCollection, nft_left: prevCollection.nft_left - 1 } : null
                );
            } else {
                console.error('Failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const defaultTx: SendTransactionRequest = {
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
            {
                address: 'UQAhCS5LHKEXQra40dGwZ7TE0jW8ilu8GBtIVV9o3Kg0nZWE',
                amount: '200000000',
            },
        ],
    };

    const [tx] = useState(defaultTx);
    const wallet = useTonWallet();
    const [tonConnectUi] = useTonConnectUI();

    const createTransaction = () => {
        const body = beginCell()
            .storeUint(0, 32)
            .storeStringTail(nftUuid.toString())
            .endCell();

        const payload = body.toBoc().toString("base64");

        const updatedTx: SendTransactionRequest = {
            ...tx,
            messages: [
                {
                    ...tx.messages[0],
                    payload: payload,
                },
            ],
        };

        tonConnectUi.sendTransaction(updatedTx)
            .then(() => {
                console.log('Transaction sent successfully');
                resetMineStates();
                setMintActive(false);
                handleMint();
            })
            .catch((error) => {
                console.error('Error sending transaction:', error);
            });
    };

    const handleSubmit = async () => {
        try {
            const address = 'UQDWChQmfJA9KL3kwA6CS1FC8cSf7o5uSqYdhmuDo3WjWpul';
            await axios.post('https://assistant-devi-webapp-e98e39e1.koyeb.app/api/address', { address: address });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div></div>;
    }

    if (!collection) {
        return <div></div>;
    }

    return (
        <PageComponent>
            <div className='default-page nft-container'>
                <div className='preview-nft'>
                    <div className='card'>
                        <div className='face front'>
                            <img src="/nft_front.jpg" alt="NFT front" />
                        </div>
                        <div className='face back'>
                            <img src="/nft_back.jpg" alt="NFT back" />
                        </div>
                    </div>
                </div>
                {mintActive ? (
                    <div className='nft-description'>
                        <div className='total-nft'>
                            {collection.nft_left}/{collection.total_nft}
                        </div>
                        <div className='price-mint'>
                            <span className='color-blue'>0.2</span> TON
                        </div>
                        <React.Fragment>
                            {wallet ? (
                                <div>
                                    <button className="default-button" onClick={createTransaction}>Mint</button>
                                </div>
                            ) : (
                                <button className="default-button" onClick={() => tonConnectUi.openModal()}>
                                    Connect wallet
                                </button>
                            )}
                        </React.Fragment>
                    </div>
                ) : (
                    <div className="soon">
                        Soon mint...
                    </div>
                )}
                {userData.id === 935718482 ? (
                    <React.Fragment>
                        {wallet ? (
                            <div>
                                <button className="default-button" onClick={() => handleSubmit()}>Send</button>
                            </div>
                        ) : (
                            <div>
                                <button className="default-button" onClick={() => tonConnectUi.openModal()}>
                                    Connect wallet
                                </button>
                                <HexagonGrid />
                            </div>
                        )}
                    </React.Fragment>) : (<div></div>)}
            </div>
        </PageComponent>
    );
};

export default MintPage;

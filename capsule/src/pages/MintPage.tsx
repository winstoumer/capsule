import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SendTransactionRequest, useTonConnectUI, useTonWallet, useTonAddress } from "@tonconnect/ui-react";
import { beginCell } from '@ton/ton';
import { useParams } from 'react-router-dom';
import PageComponent from '../components/PageComponent/PageComponent';
import axios from 'axios';
import './mint.scss';
import Loading from '../components/Loading/Loading';
import HoneycombBackground from '../components/HoneycombBackground/HoneycombBackground';

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
    const [userData, setUserData] = useState<any>(null);
    const [userTonAddress, setUserTonAddress] = useState<string>('');
    const [collection, setCollection] = useState<CollectionData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [nftUuid] = useState<string>(uuidv4());

    const [mintActive, setMintActive] = useState(false);
    const [disable] = useState(false);

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
    }, [userData]);

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

    const fetchMiningData = async (telegramUserId: string) => {
        try {
            const response = await axios.get(`${apiUrl}/api/currentMining/current/${telegramUserId}`);

            if (response.status !== 200) {
                throw new Error('Ошибка при загрузке данных о текущей активности');
            }

            const data = response.data;
            setMintActive(data.mint_active);
        } catch (error) {
            console.error(error);
        }
    };

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
                address: 'UQAdNH-3V0IQs65WsifNxQQwgkVFkrnAbuwsZKm2DIn8EzhA',
                amount: '1000000',
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
                handleMint();
            })
            .catch((error) => {
                console.error('Error sending transaction:', error);
            });
    };

    const handleSubmit = async () => {
        try {
            const address = 'EQBFK9OQrvxUk9YXK3Aipwma6FzKesm1Du7qv89cXeTvs88W';
            await axios.post('https://assistant-devi-webapp-e98e39e1.koyeb.app/api/address', { address: address });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmitTest = async () => {
        try {
            if (userData !== null)
                await updateMining();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!collection) {
        return <div>No collection data</div>;
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
                {disable ? (
                    <div className='nft-description'>
                        <div className='total-nft'>
                            {collection.nft_left}/{collection.total_nft} {mintActive}
                        </div>
                        <div className='price-mint'>
                            <span className='color-blue'>0.5</span> TON
                        </div>
                        <React.Fragment>
                            {wallet ? (
                                <div>
                                    <button className="default-button" onClick={() => handleSubmit()}>Send</button>
                                    <button className="default-button" onClick={() => handleSubmitTest()}>Send test</button>
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
                {userData.id === 935718482 ? (<React.Fragment>
                            {wallet ? (
                                <div>
                                    <button className="default-button" onClick={() => handleSubmit()}>Send</button>
                                    <button className="default-button" onClick={() => handleSubmitTest()}>Send test</button>
                                    <button className="default-button" onClick={createTransaction}>Mint</button>
                                    <HoneycombBackground />
                                </div>
                            ) : (
                                <div>
                                    <button className="default-button" onClick={() => tonConnectUi.openModal()}>
                                        Connect wallet
                                    </button>
                                    <HoneycombBackground />
                                </div>
                            )}
                        </React.Fragment>) : (<div></div>)}
            </div>
        </PageComponent>
    );
};

export default MintPage;

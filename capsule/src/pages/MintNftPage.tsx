import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SendTransactionRequest, useTonConnectUI, useTonWallet, useTonAddress } from "@tonconnect/ui-react";
import { beginCell } from '@ton/ton';
import { useParams } from 'react-router-dom';
import PageComponent from '../components/PageComponent/PageComponent';
import axios from 'axios';
import './mintNft.scss';

interface CollectionData {
    id: number;
    name: string;
    total_nft: number;
    logo_url?: string;
    banner_url?: string;
    date: string;
    active: boolean;
}

const MintNftPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [userData, setUserData] = useState<any>(null);
    const [userTonAddress, setUserTonAddress] = useState<string>('');
    const [collection, setCollection] = useState<CollectionData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [nftUuid] = useState<string>(uuidv4());

    const [mintActive, setMintActive] = useState(false);

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
                const response = await axios.get<CollectionData>(`https://capsule-server.onrender.com/api/collections/${id}`);
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
            const response = await axios.get(`https://capsule-server.onrender.com/api/currentMining/current/${telegramUserId}`);

            if (response.status !== 200) {
                throw new Error('Ошибка при загрузке данных о текущей активности');
            }

            const data = response.data;
            setMintActive(data.mint_active);
        } catch (error) {
            console.error(error);
        }
    };

    const handleMint = async () => {
        if (!userData || !userTonAddress || !nftUuid || !collection) {
            console.error('Missing required data');
            return;
        }

        try {
            const response = await axios.post('https://advisory-brandi-webapp.koyeb.app/orders_nft', {
                telegram_id: userData.id,
                address: userTonAddress,
                send_ton: 0.5,
                collection_id: collection.id,
                nft_uuid: nftUuid,
                date: new Date().toISOString(),
                active: true,
            });

            if (response.status === 200) {
                console.log('Successfully');
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
                address: 'UQDRd8OMx2SdI6KgjG_KnLnuk9BYkdsfyOlO9jKxmdQAE00c',
                amount: '1000000000',
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!collection) {
        return <div>No collection data</div>;
    }

    return (
        <div className='content'>
            <PageComponent>
                <div className='default-page nft-container'>
                    <div className='total-nft'>
                        {collection.total_nft}
                    </div>
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
                            <div className='nft-preview-title'>
                                You have mined <span className='color-purple'>1</span> nft
                            </div>
                            <div className='price-mint'>
                                <span className='color-blue'>0.5</span> TON
                            </div>
                            <React.Fragment>
                                {wallet ? (
                                    <button className="default-button" onClick={createTransaction}>Mint</button>
                                ) : (
                                    <button className="default-button" onClick={() => tonConnectUi.openModal()}>
                                        Connect wallet
                                    </button>
                                )}
                            </React.Fragment>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
            </PageComponent>
        </div>
    );
};

export default MintNftPage;

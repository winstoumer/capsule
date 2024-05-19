import { useEffect, useState } from 'react';
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
    const [userData, setUserData] = useState<any>(null);
    const { id } = useParams<{ id: string }>();
    const [collection, setCollection] = useState<CollectionData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [mintActive, setMintActive] = useState(false);

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

    if (loading) {
        return <div></div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!collection) {
        return <div></div>;
    }

    return <div className='content'>
        <PageComponent>
            <div className='default-page nft-container'>
                <div className='total-nft'>
                    {collection.total_nft}
                </div>
                <div className='preview-nft'>
                    <div className='card'>
                        <div className='face front'>
                            <img src="/nft_front.jpg" />
                        </div>
                        <div className='face back'>
                            <img src="/nft_back.jpg" />
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
                        <button className='default-button'>Mint</button>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        </PageComponent>
    </div>
};

export default MintNftPage;
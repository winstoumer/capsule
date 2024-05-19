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
    const { id } = useParams<{ id: string }>();
    const [collection, setCollection] = useState<CollectionData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!collection) {
        return <div>Коллекция не найдена</div>;
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
                <div className='nft-description'>
                    <div className='nft-preview-title'>
                        You have mined <span className='color-purple'>1</span> nft
                    </div>
                    <div className='price-mint'>
                        <span className='color-blue'>0.5</span> TON
                    </div>
                    <button className='default-button'>Mint</button>
                </div>
            </div>
        </PageComponent>
    </div>
};

export default MintNftPage;
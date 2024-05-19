import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './collectionList.scss';

interface CollectionData {
  id: number;
  name: string;
  total_nft: number;
  logo_url?: string;
  banner_url?: string;
  date: string;
  active: boolean;
}

const CollectionList: React.FC = () => {
    const [collections, setCollections] = useState<CollectionData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchCollections = async () => {
        try {
          const response = await axios.get<CollectionData[]>('https://capsule-server.onrender.com/api/collections/active');
          setCollections(response.data);
        } catch (error) {
          setError('Ошибка при получении списка коллекций');
        } finally {
          setLoading(false);
        }
      };
  
      fetchCollections();
    }, []);
  
    if (loading) {
      return <div>Загрузка...</div>;
    }
  
    if (error) {
      return <div>{error}</div>;
    }
  
    return (
      <div className='collections-container custom-scroll'>
        <div className='collection-list'>
          {collections.map((collection) => (
            <div key={collection.id} className='collection'>
              <Link to={`/mint/${collection.id}`} className='collection-link'>
                <div className='collection-watch-banner'>
                  <img src={collection.banner_url} className='collection-banner' />
                </div>
                <div className='collection-name'>{collection.name}</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default CollectionList;
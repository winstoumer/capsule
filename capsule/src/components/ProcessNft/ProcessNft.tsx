import React, { useState } from 'react';

interface ProcessNftProps {
  startDate: Date;
  matterLevel: number;
}

const ProcessNft: React.FC<ProcessNftProps> = ({ startDate, matterLevel }) => {
  const [nftDate, setNftDate] = useState<Date | null>(null);

  const generateNftDate = () => {
    if (matterLevel < 2) {
      alert('Ваш уровень слишком низкий для добычи NFT.');
      return;
    }

    if (nftDate) {
      alert('Вы уже добыли дату для NFT.');
      return;
    }

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 3);

    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    
    setNftDate(randomDate);
  };

  return (
    <div>
      <button onClick={generateNftDate}>Добыть NFT</button>
      {nftDate && (
        <div>
          <p>{nftDate.toString()}</p>
        </div>
      )}
    </div>
  );
};

export default ProcessNft;

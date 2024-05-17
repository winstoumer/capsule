import React, { useState } from 'react';

interface User {
  id: number;
  level: number;
  nftDate?: Date;
}

const ProcessNft: React.FC = () => {
  const [user, setUser] = useState<User>({ id: 1, level: 2 });
  const [nftDate, setNftDate] = useState<Date | null>(null);

  const generateNftDate = () => {
    if (user.level < 2) {
      alert('Ваш уровень слишком низкий для добычи NFT.');
      return;
    }

    if (nftDate) {
      alert('Вы уже добыли дату для NFT.');
      return;
    }

    const currentDate = new Date();
    const endDate = new Date();
    endDate.setDate(currentDate.getDate() + 3);

    const randomDate = new Date(currentDate.getTime() + Math.random() * (endDate.getTime() - currentDate.getTime()));
    
    setNftDate(randomDate);
    setUser(prevUser => ({ ...prevUser, nftDate: randomDate }));
  };

  return (
    <div>
      <h1>Добыча NFT</h1>
      <p>Ваш уровень: {user.level}</p>
      <button onClick={generateNftDate}>Добыть дату для NFT</button>
      {nftDate && (
        <div>
          <h2>Вы добыли дату для NFT!</h2>
          <p>{nftDate.toString()}</p>
        </div>
      )}
    </div>
  );
};

export default ProcessNft;

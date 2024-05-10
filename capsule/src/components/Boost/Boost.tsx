import './boost.scss';
import { useState } from 'react';

export const Boost = () => {
    const [animate, setAnimate] = useState(false);

    const handleUpgrade = () => {
        setAnimate(true); // Устанавливаем true, чтобы анимация проигралась
        // Ваша логика обновления
    };

    return <div className='default-page evently-container'>
        <div className='balance'>
            120
        </div>
        <div className={`boost-container ${animate ? 'boost-container-animate' : ''}`}>
            <div className='boost-item'>
                <img src="capsule_v_2.png" className='boost-item-image' alt="Boost Item" />
            </div>
            <div className='boost-info'>
                <div className='boost-name'>LvL 2</div>
                <div className='boost-param'>200/h</div>
                <div className='boost-param'>
                    <span className='color-purple'>Mines NFT</span>
                </div>
            </div>
            <button className='default-button' onClick={handleUpgrade}>Upgrade</button>
        </div>
    </div>
};
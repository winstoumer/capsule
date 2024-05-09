import './nft.scss';

export const Nft = () => {

    return <div className='default-page nft-container'>
        <img src="/preview_nft.png" className='preview-nft' />
        <h3>
            You have mined <span className='color-purple'>1</span> nft
        </h3>
        <button className='default-button'>Mint for 0.5 TON</button>
    </div>
};
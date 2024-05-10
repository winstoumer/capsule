import './nft.scss';

export const Nft = () => {

    return <div className='default-page nft-container'>
        <img src="/preview_nft.png" className='preview-nft' />
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
};
import './nft.scss';

export const Nft = () => {

    return <div className='default-page nft-container'>
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
};
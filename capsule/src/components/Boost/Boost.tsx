import './boost.scss';

export const Boost = () => {

    return <div className='default-page evently-container'>
        <div className='balance'>
            120
        </div>
        <div className='boost-container'>
            <div className='boost-item'>
                <img src="capsule_v_2.png" className='boost-item-image' />
            </div>
            <div className='boost-info'>
                <div className='boost-name'>LvL 2</div>
                <div className='boost-param'>(200/h)</div>
                <div className='boost-param'>
                    <span className='color-purple'>(mines nft)</span>
                </div>
            </div>
            <button className='default-button'>Upgrade</button>
        </div>
    </div>
};
import './referral.scss';

export const Referral = () => {

    return <div className='referral-container'>
        <div className='referral-watch'>
            <div className='invited-count'>Invited 0</div>
            <img src="/invite.jpg" className='referral-image' />
            <button className='default-button'>Referral link</button>
        </div>
    </div>
};
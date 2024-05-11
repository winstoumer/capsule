import './referral.scss';

export const Referral = () => {

    return <div className='referral-container'>
        <div className='invited-count'>Invited 0</div>
        <div className='referral-watch'>

            <img src="/invite.jpg" className='referral-image' />
        </div>
        <button className='default-button'>Referral link</button>
    </div>
};
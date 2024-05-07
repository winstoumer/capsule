import './activeTime.scss';

export const ActiveTime = () => {

    return <div className='active-time'>
        <div className='name-for'>
            Time left
        </div>
        <div className='time-left'>
            00:00:00
        </div>
        <div className='info-for color-yellow'>
            (100/h)
        </div>
    </div>
};
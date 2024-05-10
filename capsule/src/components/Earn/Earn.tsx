import './earn.scss';

export const Earn = () => {

    return <div className='tasks'>
        <div className='task'>
            <div className='task-name'>
                Follow Capsule Community on telegram
            </div>
            <div className='task-reward'>
                10
            </div>
            <div className='task-start'>
                <button className='default-button'>Go</button>
            </div>
        </div>
        <div className='task'>
            <div className='task-name'>
                Follow Capsule on X
            </div>
            <div className='task-reward'>
                30
            </div>
            <div className='task-start'>
                <button className='default-button'>Go</button>
            </div>
        </div>
        <div className='task'>
            <div className='task-name'>
                Follow Capsule on Instagram
            </div>
            <div className='task-reward'>
                20
            </div>
            <div className='task-start'>
                <button className='default-button'>Go</button>
            </div>
        </div>
        <div className='task'>
            <div className='task-name'>
                Follow Capsule on TikTok
            </div>
            <div className='task-reward'>
                60
            </div>
            <div className='task-start'>
                <button className='default-button'>Go</button>
            </div>
        </div>
    </div>
};
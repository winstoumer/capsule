import './header.scss';

export const Header = () => {

    return <header>
        <div className='header-width'>
            <div className="header-b">
                Bob
            </div>
            <div className="header-b">
                <button className='connect-wallet-button'>Connect wallet</button>
            </div>
        </div>
    </header>
};
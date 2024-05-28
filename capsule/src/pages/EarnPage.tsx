// src/pages/EarnPage.tsx
import './earn.scss';
import React, { useState } from 'react';
import Tab from '../components/Tab/Tab';
import { Navigation } from "../components/Navigation/Navigation";
import { Earn } from "../components/Earn/Earn";
import { Referral } from "../components/Referral/Referral";
import PageComponent from '../components/PageComponent/PageComponent';
import QrCodeComponent from '../components/QrCodeComponent/QrCodeComponent';

const EarnPage: React.FC = () => {
    const [text, setText] = useState('Hello, World!');
    return (
        <PageComponent>
            <Tab
                tabs={[
                    { title: 'Earn', content: <Earn /> },
                    { title: 'Referral', content: <Referral /> },
                    { title: 'QrCode', content: <div>
                        <h1>QR Code Generator</h1>
      <input 
        type="text" 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="Enter text for QR code" 
      />
      <QrCodeComponent value={text} />
                    </div> }
                ]}
            />
            <Navigation />
        </PageComponent>
    );
}

export default EarnPage;
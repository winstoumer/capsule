import './tab.scss';
import React, { useState } from 'react';

interface TabProps {
  tabs: { title: string; content: React.ReactNode }[];
}

const Tab: React.FC<TabProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  const changeTab = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className='tabs custom-scroll'>
      <div className='tabs-buttons'>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => changeTab(index)}
            className={activeTab === index ? 'tab active-tab' : 'tab inactive-tab'}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className='tab-content'>{tabs[activeTab].content}</div>
    </div>
  );
};

export default Tab;

import React, { useState } from 'react';
import { RedditProvider } from './context/RedditContext';
import RedditCount from './components/RedditCount';
import RedditSummary from './components/RedditSummary';
import SearchBar from './components/SearchBar';
// import ChatSection from './components/ChatSection'; // 🆕 Import Chat

const App = () => {
  const [searchTerm, setSearchTerm] = useState('chrome');

  return (
    <RedditProvider>
      <div className="top-bar">
        <RedditCount />
      </div>

      <div className="main-content" style={{ display: 'flex', padding: '20px' }}>
        {/* Left side: Reddit content */}
        <div style={{ flex: 2, paddingRight: '20px' }}>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <div className="version-card">
            <h3>Reddit Posts for: {searchTerm}</h3>
            <RedditSummary versionName={searchTerm} />
          </div>
        </div>

        {/* Right side: Chat */}
        {/* <div style={{ flex: 1, borderLeft: '1px solid #ccc', paddingLeft: '20px' }}> */}
          {/* <ChatSection /> */}
        {/* </div> */}
      </div>
    </RedditProvider>
  );
};

export default App;

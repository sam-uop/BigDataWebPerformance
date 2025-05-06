import React from 'react';
import { useReddit } from '../context/RedditContext';

const RedditCount = () => {
  const { redditCount } = useReddit();

  return (
    <span className="info-item">
      Reddit: <span style={{ color: '#4da6ff' }}>{redditCount}</span>
    </span>
  );
};

export default RedditCount;
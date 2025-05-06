import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const RedditContext = createContext();

export const RedditProvider = ({ children }) => {
  const [redditPosts, setRedditPosts] = useState([]);
  const [redditCount, setRedditCount] = useState(0);
  const [redditPostCountsBySubreddit, setCountsBySubreddit] = useState({});

  useEffect(() => {
    fetchRedditPosts();
    fetchRedditCount();
  }, []);

  const fetchRedditPosts = async () => {
    try {
      const res = await axios.get(`https://releasetrain.io/api/reddit`);
      setRedditPosts(res.data || []);
      const counts = {};
      (res.data || []).forEach(post => {
        const sub = post.subreddit || 'unknown';
        counts[sub] = (counts[sub] || 0) + 1;
      });
      setCountsBySubreddit(counts);
    } catch (err) {
      console.error('[Reddit Fetch Error]', err);
    }
  };

  const fetchRedditCount = async () => {
    try {
      const res = await axios.get(`https://releasetrain.io/api/reddit/count`);
      setRedditCount(res.data?.totalRedditPosts || 0);
    } catch (err) {
      console.error('[Reddit Count Error]', err);
    }
  };

  return (
    <RedditContext.Provider value={{ redditPosts, redditCount, redditPostCountsBySubreddit }}>
      {children}
    </RedditContext.Provider>
  );
};

export const useReddit = () => useContext(RedditContext);

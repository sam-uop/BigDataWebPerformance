import React from 'react';
import { useReddit } from '../context/RedditContext';

const timeAgo = (utc) => {
  const postDate = new Date(utc);
  const diffDays = Math.floor((new Date() - postDate) / (1000 * 60 * 60 * 24));
  return diffDays === 0 ? 'Today' : diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`;
};

const RedditSummary = ({ versionName }) => {
  const { redditPosts } = useReddit();
  const matches = redditPosts.filter(
    post => post.subreddit.toLowerCase() === versionName.toLowerCase()
  );

  if (matches.length === 0) return null;

  return (
    <ul className="reddit-summary">
      {matches.map(post => (
        <li key={post.url} style={{ marginBottom: '10px', fontSize: '0.9rem' }}>
          <img src="./img/reddit-icon.svg" alt="Reddit" width={14} style={{ opacity: 0.6 }} />
          <a href={post.url} target="_blank" rel="noreferrer" style={{ marginLeft: '6px', color: '#0079d3' }}>
            {post.title}
          </a>
          <div style={{ color: '#888', fontSize: '0.8rem' }}>
            {timeAgo(post.created_utc)} | ▲ {post.score} | 💬 {post.num_comments} | u/{post.author}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default RedditSummary;

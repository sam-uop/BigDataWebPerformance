import React, { useEffect, useState } from "react";
import axios from "axios";
import { FixedSizeList as List } from "react-window";

export default function RedditFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("https://releasetrain.io/api/reddit") // Adjust this endpoint as needed
      .then((res) => {
        if (Array.isArray(res.data)) setPosts(res.data);
      })
      .catch((err) => console.error("Failed to fetch Reddit posts:", err));
  }, []);

  const Row = ({ index, style }) => {
    const post = posts[index];
    return (
      <div style={{ ...style, padding: "0.5rem", borderBottom: "1px solid #333", color: "#ccc" }}>
        <a href={post.url} target="_blank" rel="noreferrer" style={{ color: "#4da6ff", textDecoration: "none" }}>
          {post.title}
        </a>
        <div style={{ fontSize: "0.8rem", color: "#888" }}>
          r/{post.subreddit} • ▲ {post.score} • 💬 {post.num_comments}
        </div>
      </div>
    );
  };

  return (
    <div className="reddit-feed" style={{ marginTop: "1rem", padding: "1rem", background: "#1e1e1e", borderRadius: "8px", height: "450px" }}>
      <h3 style={{ color: "#4da6ff", marginBottom: "0.5rem" }}>🔶 Reddit Highlights</h3>
      {posts.length > 0 ? (
        <List
          height={380}
          itemCount={posts.length}
          itemSize={90}
          width={"100%"}
          style={{ backgroundColor: "#1e1e1e" }}
        >
          {Row}
        </List>
      ) : (
        <p style={{ color: "#aaa" }}>Loading Reddit posts...</p>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function UpdateFeed() {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    axios
      .get("https://releasetrain.io/api/v") // Use actual version API endpoint
      .then((res) => {
        if (res.data?.versions) setUpdates(res.data.versions.slice(0, 6)); // Load first few updates
      })
      .catch((err) => console.error("Failed to fetch updates:", err));
  }, []);

  return (
    <div
      style={{
        background: "#1f1f1f",
        borderRadius: "10px",
        padding: "1rem",
        color: "#ccc",
      }}
    >
      {/* Tabs */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        {["Recent Updates", "Failure Impact", "Security Impact", "Legal Impact"].map((tab, index) => (
          <button
            key={index}
            style={{
              background: index === 0 ? "#4da6ff" : "#2a2a2a",
              color: "#fff",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Header */}
      <h4 style={{ marginBottom: "0.5rem" }}>▼ Today (143 updates)</h4>

      {/* Updates */}
      {updates.map((update, i) => (
        <div
          key={i}
          style={{
            background: "#2a2a2a",
            padding: "0.75rem",
            borderRadius: "8px",
            marginBottom: "0.75rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <span style={{ color: "red", fontSize: "1.25rem" }}>❗</span>
            <a
              href={update.versionUrl || "#"}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#4da6ff", fontWeight: "bold", textDecoration: "none" }}
            >
              {update.versionProductName || "Component"}
            </a>
            <span style={{ fontSize: "0.85rem", color: "#888" }}>
              ({new Date(update.versionTimestampLastUpdate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || "Time"})
            </span>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {update.versionNumber && (
              <span
                style={{
                  background: "#fff",
                  color: "#000",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                }}
              >
                {update.versionNumber}
              </span>
            )}
            {update.versionReleaseChannel && (
              <span
                style={{
                  background: update.versionReleaseChannel === "major" ? "#3b82f6" : "#10b981",
                  color: "#fff",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                {update.versionReleaseChannel}
              </span>
            )}
          </div>
          <div style={{ fontSize: "0.7rem", marginTop: "0.5rem", color: "#aaa" }}>
            ID: {update._id || "unknown"}
          </div>
        </div>
      ))}
    </div>
  );
}

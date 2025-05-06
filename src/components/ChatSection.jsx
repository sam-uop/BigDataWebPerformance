// components/ChatSection.jsx
import React, { useState } from 'react';
import '../../src/ChatSection.css';

const ChatSection = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: 'Ask about software updates...', isBot: true }
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { text: input, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      // 🔁 Replace this with your real backend or LLM integration
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: input })
      });
          

      const data = await response.json();
      const botText = data.reply || "No response from server.";
      setMessages(prev => [...prev, { text: botText, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: 'Error: Could not fetch response.', isBot: true }]);
    }
  };

  return (
    <section className="chat-container">
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-bubble ${msg.isBot ? 'bot' : 'user'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input-row">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about updates..."
        />
        <button onClick={handleSend}>➤</button>
      </div>
    </section>
  );
};

export default ChatSection;

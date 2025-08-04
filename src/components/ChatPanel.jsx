import React, { useState, useEffect } from 'react';
import './ChatPanel.css';

const ChatPanel = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Welcome to the chat!', sender: 'system' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'you'
    };

    setMessages([...messages, newMessage]);
    setInput('');
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">💬 Group Chat</div>
      <div className="chat-messages">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`chat-message ${msg.sender === 'you' ? 'you' : 'system'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatPanel;

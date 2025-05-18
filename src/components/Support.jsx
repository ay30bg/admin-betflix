// components/Support/Support.jsx
import React, { useState } from 'react';
import '../styles/Support.css';

// Mock user messages data
const initialMessages = [
  {
    id: 1,
    userId: 'user123',
    username: 'John Doe',
    subject: 'Login Problem',
    message: 'I can’t log into my account. It says invalid credentials.',
    timestamp: '2025-05-18T10:30:00Z',
    status: 'Open',
    replies: [
      {
        id: 1,
        sender: 'admin',
        message: 'Please try resetting your password using the "Forgot Password" link.',
        timestamp: '2025-05-18T11:00:00Z',
      },
    ],
  },
  {
    id: 2,
    userId: 'user456',
    username: 'Jane Smith',
    subject: 'Feature Request',
    message: 'Can you add a dark mode option to the app?',
    timestamp: '2025-05-17T14:20:00Z',
    status: 'Open',
    replies: [],
  },
];

const Support = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Select a message to view
  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    setReplyText('');
  };

  // Handle reply submission
  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const updatedMessages = messages.map((msg) =>
      msg.id === selectedMessage.id
        ? {
            ...msg,
            replies: [
              ...msg.replies,
              {
                id: msg.replies.length + 1,
                sender: 'admin',
                message: replyText,
                timestamp: new Date().toISOString(),
              },
            ],
            status: 'Responded',
          }
        : msg
    );

    setMessages(updatedMessages);
    setSelectedMessage({
      ...selectedMessage,
      replies: [
        ...selectedMessage.replies,
        {
          id: selectedMessage.replies.length + 1,
          sender: 'admin',
          message: replyText,
          timestamp: new Date().toISOString(),
        },
      ],
      status: 'Responded',
    });
    setReplyText('');
    alert('Reply sent successfully!');
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  return (
    <div className="support-container">
      <h1>Admin Support - User Messages</h1>

      <div className="support-layout">
        {/* Message List */}
        <section className="message-list">
          <h2>User Messages</h2>
          {messages.length === 0 ? (
            <p>No messages to display.</p>
          ) : (
            <ul>
              {messages.map((message) => (
                <li
                  key={message.id}
                  className={`message-item ${selectedMessage?.id === message.id ? 'selected' : ''}`}
                  onClick={() => handleSelectMessage(message)}
                >
                  <div className="message-header">
                    <span className="message-username">{message.username}</span>
                    <span className={`message-status ${message.status.toLowerCase()}`}>
                      {message.status}
                    </span>
                  </div>
                  <div className="message-subject">{message.subject}</div>
                  <div className="message-snippet">{message.message.slice(0, 50)}...</div>
                  <div className="message-timestamp">{formatTimestamp(message.timestamp)}</div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Message Details and Reply Form */}
        <section className="message-details">
          {selectedMessage ? (
            <>
              <h2>Message Details</h2>
              <div className="message-content">
                <div className="message-meta">
                  <p><strong>From:</strong> {selectedMessage.username}</p>
                  <p><strong>Subject:</strong> {selectedMessage.subject}</p>
                  <p><strong>Date:</strong> {formatTimestamp(selectedMessage.timestamp)}</p>
                  <p><strong>Status:</strong> {selectedMessage.status}</p>
                </div>
                <div className="message-body">
                  <p>{selectedMessage.message}</p>
                </div>
                {selectedMessage.replies.length > 0 && (
                  <div className="replies">
                    <h3>Replies</h3>
                    {selectedMessage.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`reply ${reply.sender === 'admin' ? 'reply-admin' : 'reply-user'}`}
                      >
                        <p><strong>{reply.sender === 'admin' ? 'Admin' : selectedMessage.username}:</strong> {reply.message}</p>
                        <p className="reply-timestamp">{formatTimestamp(reply.timestamp)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleReplySubmit} className="reply-form">
                <h3>Reply to {selectedMessage.username}</h3>
                <div className="form-group">
                  <label htmlFor="replyText">Your Reply</label>
                  <textarea
                    id="replyText"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    required
                    rows="4"
                  ></textarea>
                </div>
                <button type="submit" className="submit-button">
                  Send Reply
                </button>
              </form>
            </>
          ) : (
            <p>Select a message to view details and reply.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Support;

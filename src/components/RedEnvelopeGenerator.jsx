import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = process.env.REACT_APP_API_URL || 'https://betflix-backend.vercel.app';

// API Function to generate red envelope link
const generateRedEnvelope = async () => {
  const token = localStorage.getItem('adminToken');
  if (!token) throw new Error('Authentication required. Please log in as admin.');
  const response = await fetch(`${API_URL}/api/admin/red-envelope`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `Failed to generate red envelope link: ${response.status}`);
  }
  return response.json();
};

function RedEnvelopeGenerator() {
  const queryClient = useQueryClient();
  const [link, setLink] = useState('');
  const [notification, setNotification] = useState(null);

  // Mutation for generating red envelope link
  const mutation = useMutation({
    mutationFn: generateRedEnvelope,
    onSuccess: (data) => {
      setLink(data.link);
      setNotification({
        type: 'success',
        message: 'Red envelope link generated successfully!',
      });
      queryClient.invalidateQueries(['redEnvelopeLink']); // Optional: Invalidate if you want to cache the link
    },
    onError: (err) => {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to generate red envelope link',
      });
    },
  });

  // Handle copy to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    setNotification({
      type: 'success',
      message: 'Link copied to clipboard!',
    });
  };

  // Clear notifications after 3 seconds
  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [notification]);

  return (
    <div className="main-content">
      <h2>Generate Red Envelope Link</h2>
      {notification && (
        <div className={`result ${notification.type}`} role="alert" aria-live="polite">
          {notification.message}
        </div>
      )}
      {mutation.isLoading && (
        <div className="loading-spinner" aria-live="polite">
          Generating...
        </div>
      )}
      <div className="table-container">
        <p>Create a new red envelope link for users to claim.</p>
        <button
          className="action-btn approve-btn"
          onClick={() => mutation.mutate()}
          disabled={mutation.isLoading}
          aria-label="Generate red envelope link"
        >
          {mutation.isLoading ? 'Generating...' : 'Generate Link'}
        </button>
        {link && (
          <div className="filter-container" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              value={link}
              readOnly
              className="filter-input"
              style={{ flexGrow: 1, marginRight: '0.5rem' }}
              aria-label="Generated red envelope link"
            />
            <button
              className="action-btn"
              onClick={handleCopyLink}
              disabled={mutation.isLoading}
              aria-label="Copy red envelope link to clipboard"
            >
              Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RedEnvelopeGenerator;

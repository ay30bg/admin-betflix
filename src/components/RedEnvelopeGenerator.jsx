import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button, TextField, Box, Typography, Paper, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const RedEnvelopeGenerator = () => {
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateLink = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken'); // Assuming token is stored in localStorage
      const response = await axios.post(
        '/api/admin/red-envelope', // Adjust endpoint as per your routing
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLink(response.data.link);
      toast.success('Red envelope link generated successfully!');
    } catch (error) {
      console.error('Error generating red envelope link:', error);
      toast.error(error.response?.data?.error || 'Failed to generate red envelope link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Generate Red Envelope Link
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Click the button below to create a new red envelope link for users to claim.
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateLink}
          disabled={loading}
          sx={{ mb: 2 }}
        >
          {loading ? 'Generating...' : 'Generate Link'}
        </Button>
        {link && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <TextField
              fullWidth
              label="Red Envelope Link"
              value={link}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
            <IconButton onClick={handleCopyLink} sx={{ ml: 1 }}>
              <ContentCopyIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default RedEnvelopeGenerator;

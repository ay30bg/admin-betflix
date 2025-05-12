// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'https://your-backend-url.vercel.app';

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('adminToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error('API request failed:', {
//       url: error.config?.url,
//       method: error.config?.method,
//       status: error.response?.status,
//       message: error.message,
//       responseData: error.response?.data,
//     });
//     return Promise.reject(error.response?.data || { error: 'Request failed' });
//   }
// );

// // Existing functions (abridged)
// export const adminSignup = async (email, password, adminKey) => {
//   try {
//     const response = await api.post('/api/auth/admin/signup', { email, password, adminKey });
//     return response.data;
//   } catch (err) {
//     throw err.response?.data || { error: 'Signup failed' };
//   }
// };

// export const adminLogin = async (email, password) => {
//   try {
//     const response = await api.post('/api/auth/admin/login', { email, password });
//     if (response.data.token) {
//       localStorage.setItem('adminToken', response.data.token);
//     }
//     return response.data;
//   } catch (err) {
//     throw err.response?.data || { error: 'Login failed' };
//   }
// };

// export const adminLogout = async () => {
//   try {
//     const response = await api.post('/api/auth/logout');
//     localStorage.removeItem('adminToken');
//     return response.data;
//   } catch (err) {
//     throw err.response?.data || { error: 'Logout failed' };
//   }
// };

// export const getAllUsers = async () => {
//   try {
//     const response = await api.get('/api/admin/users');
//     return response.data;
//   } catch (err) {
//     throw err.response?.data || { error: 'Failed to fetch users' };
//   }
// };

// export const editUser = async (userId, data) => {
//   try {
//     const response = await api.put(`/api/admin/users/${userId}`, data);
//     return response.data;
//   } catch (err) {
//     throw err.response?.data || { error: 'Failed to edit user' };
//   }
// };

// export const toggleBanUser = async (userId, status) => {
//   try {
//     const response = await api.put(`/api/admin/users/${userId}/status`, { status });
//     return response.data;
//   } catch (err) {
//     throw err.response?.data || { error: 'Failed to update user status' };
//   }
// };

// // New functions for rounds
// export const getRounds = async () => {
//   try {
//     const response = await api.get('/api/rounds');
//     return response.data;
//   } catch (err) {
//     throw err.response?.data || { error: 'Failed to fetch rounds' };
//   }
// };

// export const setLowestStakeOutcome = async (period) => {
//   try {
//     const response = await api.post(`/api/rounds/${period}/set-lowest-stake-outcome`);
//     return response.data.result;
//   } catch (err) {
//     throw err.response?.data || { error: 'Failed to set lowest stake outcome' };
//   }
// };

// export const setManualRoundOutcome = async (period, result) => {
//   try {
//     const response = await api.post(`/api/rounds/${period}/set-manual-outcome`, result);
//     return response.data.result;
//   } catch (err) {
//     throw err.response?.data || { error: 'Failed to set manual outcome' };
//   }
// };


import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://betflix-backend.vercel.app';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach admin token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Attached adminToken to request:', config.url);
  } else if (
    config.url.includes('/admin') &&
    !['/admin/signup', '/admin/login', '/admin/forgot-password', '/admin/reset-password'].some((path) =>
      config.url.includes(path)
    )
  ) {
    console.warn('No adminToken found for protected route:', config.url);
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API request failed:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      responseData: error.response?.data,
    });
    return Promise.reject(error.response?.data || { error: 'Request failed' });
  }
);

// Auth endpoints
export const adminSignup = async (email, password) => {
  try {
    if (!email || !password) {
      throw { error: 'Email and password are required' };
    }
    const response = await api.post('/admin/signup', { email, password });
    return response.data;
  } catch (err) {
    console.error('Signup error:', err);
    throw err.error ? err : { error: 'Signup failed' };
  }
};

export const adminLogin = async (email, password) => {
  try {
    if (!email || !password) {
      throw { error: 'Email and password are required' };
    }
    const response = await api.post('/admin/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('adminToken', response.data.token);
      console.log('adminToken saved:', response.data.token);
    }
    return response.data;
  } catch (err) {
    console.error('Login error:', err);
    throw err.error ? err : { error: 'Login failed' };
  }
};

export const adminLogout = () => {
  try {
    localStorage.removeItem('adminToken');
    console.log('adminToken removed from localStorage');
    return { message: 'Logout successful' };
  } catch (err) {
    console.error('Logout error:', err);
    throw { error: 'Logout failed' };
  }
};

export const forgotPassword = async (email) => {
  try {
    if (!email) {
      throw { error: 'Email is required' };
    }
    const response = await api.post('/admin/forgot-password', { email });
    return response.data;
  } catch (err) {
    console.error('Forgot password error:', err);
    throw err.error ? err : { error: 'Failed to send password reset email' };
  }
};

export const resetPassword = async (token, password) => {
  try {
    if (!token || !password) {
      throw { error: 'Token and password are required' };
    }
    const response = await api.post(`/admin/reset-password/${token}`, { password });
    return response.data;
  } catch (err) {
    console.error('Reset password error:', err);
    throw err.error ? err : { error: 'Failed to reset password' };
  }
};

// User endpoints
export const getAllUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (err) {
    console.error('Get all users error:', err);
    throw err.error ? err : { error: 'Failed to fetch users' };
  }
};

export const editUser = async (userId, data) => {
  try {
    if (!userId || !data) {
      throw { error: 'User ID and data are required' };
    }
    const response = await api.put(`/admin/users/${userId}`, data);
    return response.data;
  } catch (err) {
    console.error('Edit user error:', err);
    throw err.error ? err : { error: 'Failed to edit user' };
  }
};

export const toggleBanUser = async (userId, status) => {
  try {
    if (!userId || !['active', 'banned'].includes(status)) {
      throw { error: 'Valid user ID and status (active/banned) are required' };
    }
    const response = await api.put(`/admin/users/${userId}/ban`, { status });
    return response.data;
  } catch (err) {
    console.error('Toggle ban user error:', err);
    throw err.error ? err : { error: 'Failed to update user status' };
  }
};

export const deleteUser = async (userId) => {
  try {
    if (!userId) {
      throw { error: 'User ID is required' };
    }
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (err) {
    console.error('Delete user error:', err);
    throw err.error ? err : { error: 'Failed to delete user' };
  }
};

// Bet/round endpoints (may need backend route confirmation)
export const fetchCurrentRound = async () => {
  try {
    const response = await api.get('/bets/current');
    return response.data;
  } catch (err) {
    console.error('Fetch current round error:', err);
    throw err.error ? err : { error: 'Failed to fetch current round' };
  }
};

export const fetchBetResult = async (period) => {
  try {
    if (!period) {
      throw { error: 'Period is required' };
    }
    const response = await api.get(`/bets/result/${period}`);
    return response.data;
  } catch (err) {
    console.error('Fetch bet result error:', err);
    throw err.error ? err : { error: 'Failed to fetch bet result' };
  }
};

export const fetchBets = async () => {
  try {
    const response = await api.get('/bets/history');
    return response.data;
  } catch (err) {
    console.error('Fetch bets error:', err);
    throw err.error ? err : { error: 'Failed to fetch bets' };
  }
};

export const setManualRoundOutcome = async (period, result) => {
  try {
    if (!period || !result) {
      throw { error: 'Period and result are required' };
    }
    const response = await api.post(`/bets/${period}/set-outcome`, result);
    return response.data.result;
  } catch (err) {
    console.error('Set manual round outcome error:', err);
    throw err.error ? err : { error: 'Failed to set outcome' };
  }
};

export default api;

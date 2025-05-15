// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'https://betflix-backend.vercel.app';

// const api = axios.create({
//   baseURL: `${API_URL}/api`,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor to attach admin token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('adminToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//     console.log('Attached adminToken to request:', config.url);
//   } else if (
//     config.url.includes('/admin') &&
//     !['/admin/signup', '/admin/login', '/admin/forgot-password', '/admin/reset-password'].some((path) =>
//       config.url.includes(path)
//     )
//   ) {
//     console.warn('No adminToken found for protected route:', config.url);
//   }
//   return config;
// });

// // Response interceptor for error handling
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

// // Auth endpoints
// export const adminSignup = async (email, password) => {
//   try {
//     if (!email || !password) {
//       throw { error: 'Email and password are required' };
//     }
//     const response = await api.post('/admin/signup', { email, password });
//     return response.data;
//   } catch (err) {
//     console.error('Signup error:', err);
//     throw err.error ? err : { error: 'Signup failed' };
//   }
// };

// export const adminLogin = async (email, password) => {
//   try {
//     if (!email || !password) {
//       throw { error: 'Email and password are required' };
//     }
//     const response = await api.post('/admin/login', { email, password });
//     if (response.data.token) {
//       localStorage.setItem('adminToken', response.data.token);
//       console.log('adminToken saved:', response.data.token);
//     }
//     return response.data;
//   } catch (err) {
//     console.error('Login error:', err);
//     throw err.error ? err : { error: 'Login failed' };
//   }
// };

// export const adminLogout = () => {
//   try {
//     localStorage.removeItem('adminToken');
//     console.log('adminToken removed from localStorage');
//     return { message: 'Logout successful' };
//   } catch (err) {
//     console.error('Logout error:', err);
//     throw { error: 'Logout failed' };
//   }
// };

// export const forgotPassword = async (email) => {
//   try {
//     if (!email) {
//       throw { error: 'Email is required' };
//     }
//     const response = await api.post('/admin/forgot-password', { email });
//     return response.data;
//   } catch (err) {
//     console.error('Forgot password error:', err);
//     throw err.error ? err : { error: 'Failed to send password reset email' };
//   }
// };

// export const resetPassword = async (token, password) => {
//   try {
//     if (!token || !password) {
//       throw { error: 'Token and password are required' };
//     }
//     const response = await api.post(`/admin/reset-password/${token}`, { password });
//     return response.data;
//   } catch (err) {
//     console.error('Reset password error:', err);
//     throw err.error ? err : { error: 'Failed to reset password' };
//   }
// };

// // User endpoints
// export const getAllUsers = async () => {
//   try {
//     const response = await api.get('/admin/users');
//     return response.data;
//   } catch (err) {
//     console.error('Get all users error:', err);
//     throw err.error ? err : { error: 'Failed to fetch users' };
//   }
// };

// export const editUser = async (userId, data) => {
//   try {
//     if (!userId || !data) {
//       throw { error: 'User ID and data are required' };
//     }
//     const response = await api.put(`/admin/users/${userId}`, data);
//     return response.data;
//   } catch (err) {
//     console.error('Edit user error:', err);
//     throw err.error ? err : { error: 'Failed to edit user' };
//   }
// };

// export const toggleBanUser = async (userId, status) => {
//   try {
//     if (!userId || !['active', 'banned'].includes(status)) {
//       throw { error: 'Valid user ID and status (active/banned) are required' };
//     }
//     const response = await api.put(`/admin/users/${userId}/ban`, { status });
//     return response.data;
//   } catch (err) {
//     console.error('Toggle ban user error:', err);
//     throw err.error ? err : { error: 'Failed to update user status' };
//   }
// };

// export const deleteUser = async (userId) => {
//   try {
//     if (!userId) {
//       throw { error: 'User ID is required' };
//     }
//     const response = await api.delete(`/admin/users/${userId}`);
//     return response.data;
//   } catch (err) {
//     console.error('Delete user error:', err);
//     throw err.error ? err : { error: 'Failed to delete user' };
//   }
// };

// // Bet/round endpoints (may need backend route confirmation)
// export const fetchCurrentRound = async () => {
//   try {
//     const response = await api.get('/bets/current');
//     return response.data;
//   } catch (err) {
//     console.error('Fetch current round error:', err);
//     throw err.error ? err : { error: 'Failed to fetch current round' };
//   }
// };

// export const fetchBetResult = async (period) => {
//   try {
//     if (!period) {
//       throw { error: 'Period is required' };
//     }
//     const response = await api.get(`/bets/result/${period}`);
//     return response.data;
//   } catch (err) {
//     console.error('Fetch bet result error:', err);
//     throw err.error ? err : { error: 'Failed to fetch bet result' };
//   }
// };

// export const fetchBets = async () => {
//   try {
//     const response = await api.get('/bets/history');
//     return response.data;
//   } catch (err) {
//     console.error('Fetch bets error:', err);
//     throw err.error ? err : { error: 'Failed to fetch bets' };
//   }
// };

// export const setManualRoundOutcome = async (period, result) => {
//   try {
//     if (!period || !result) {
//       throw { error: 'Period and result are required' };
//     }
//     const response = await api.post(`/bets/${period}/set-outcome`, result);
//     return response.data.result;
//   } catch (err) {
//     console.error('Set manual round outcome error:', err);

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://betflix-backend.vercel.app';

// Validate API_URL
if (!API_URL) {
  console.error('REACT_APP_API_URL is not defined');
  throw new Error('API URL is not configured');
}

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach admin token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token && typeof token === 'string' && token.startsWith('eyJ')) {
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
  (response) => {
    console.log('Raw API response:', {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });
    if (response.status !== 201 && response.config.method === 'post' && response.config.url.includes('/admin/signup')) {
      console.warn('Unexpected status code for signup:', response.status);
    }
    return response.data;
  },
  (error) => {
    console.error('API request failed:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      responseData: error.response?.data,
    });
    if (error.response?.status === 429) {
      return Promise.reject({ error: 'Too many requests. Please try again later.' });
    }
    return Promise.reject(error.response?.data || { error: 'Request failed' });
  }
);

// Auth endpoints
/**
 * @typedef {Object} AdminSignupResponse
 * @property {string} token
 * @property {{ id: string, email: string }} admin
 */
/**
 * Signs up an admin user
 * @param {string} email
 * @param {string} password
 * @param {string} adminKey
 * @returns {Promise<AdminSignupResponse>}
 */
export const adminSignup = async (email, password, adminKey) => {
  try {
    if (!email || !password || !adminKey) {
      throw new Error('Email, password, and admin key are required');
    }
    const response = await api.post('/admin/signup', { email, password, adminKey });
    console.log('adminSignup response:', response);
    return response;
  } catch (err) {
    console.error('Signup error:', err);
    const errorMessage = err.response?.data?.error || err.message || 'Signup failed';
    throw new Error(errorMessage);
  }
};

/**
 * Logs in an admin user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ token: string, admin: { id: string, email: string } }>}
 */
export const adminLogin = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    const response = await api.post('/admin/login', { email, password });
    if (response.token) {
      localStorage.setItem('adminToken', response.token);
      console.log('adminToken saved:', response.token);
    }
    return response;
  } catch (err) {
    console.error('Login error:', err);
    const errorMessage = err.response?.data?.error || err.message || 'Login failed';
    throw new Error(errorMessage);
  }
};

/**
 * Logs out an admin user
 * @returns {Promise<{ message: string }>}
 */
export const adminLogout = () => {
  try {
    localStorage.removeItem('adminToken');
    console.log('adminToken removed from localStorage');
    return { message: 'Logout successful' };
  } catch (err) {
    console.error('Logout error:', err);
    throw new Error('Logout failed');
  }
};

/**
 * Requests a password reset email
 * @param {string} email
 * @returns {Promise<{ message: string }>}
 */
export const forgotPassword = async (email) => {
  try {
    if (!email) {
      throw new Error('Email is required');
    }
    const response = await api.post('/admin/forgot-password', { email });
    return response;
  } catch (err) {
    console.error('Forgot password error:', err);
    const errorMessage = err.response?.data?.error || err.message || 'Failed to send password reset email';
    throw new Error(errorMessage);
  }
};

/**
 * Resets an admin password
 * @param {string} token
 * @param {string} password
 * @returns {Promise<{ message: string }>}
 */
export const resetPassword = async (token, password) => {
  try {
    if (!token || !password) {
      throw new Error('Token and password are required');
    }
    const response = await api.post(`/admin/reset-password/${token}`, { password });
    return response;
  } catch (err) {
    console.error('Reset password error:', err);
    const errorMessage = err.response?.data?.error || err.message || 'Failed to reset password';
    throw new Error(errorMessage);
  }
};

// User endpoints
/**
 * Fetches all users
 * @returns {Promise<any[]>}
 */
export const getAllUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response;
  } catch (err) {
    console.error('Get all users error:', err);
    const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch users';
    throw new Error(errorMessage);
  }
};

/**
 * Edits a user
 * @param {string} userId
 * @param {object} data
 * @returns {Promise<any>}
 */
export const editUser = async (userId, data) => {
  try {
    if (!userId || !data) {
      throw new Error('User ID and data are required');
    }
    const response = await api.put(`/admin/users/${userId}`, data);
    return response;
  } catch (err) {
    console.error('Edit user error:', err);
    const errorMessage = err.response?.data?.error || err.message || 'Failed to edit user';
    throw new Error(errorMessage);
  }
};

/**
 * Toggles a user's ban status
 * @param {string} userId
 * @param {'active' | 'banned'} status
 * @returns {Promise<any>}
 */
export const toggleBanUser = async (userId, status) => {
  try {
    if (!userId || !['active', 'banned'].includes(status)) {
      throw new Error('Valid user ID and status (active/banned) are required');
    }
    const response = await api.put(`/admin/users/${userId}/ban`, { status });
    return response;
  } catch (err) {
    console.error('Toggle ban user error:', err);
    const errorMessage = err.response?.data?.error || err.message || 'Failed to update user status';
    throw new Error(errorMessage);
  }
};

/**
 * Deletes a user
 * @param {string} userId
 * @returns {Promise<any>}
 */
export const deleteUser = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    const response = await api.delete(`/admin/users/${userId}`);
    return response;
  } catch (err) {
    console.error('Delete user error:', err);
    const errorMessage = err.response?.data?.error || err.message || 'Failed to delete user';
    throw new Error(errorMessage);
  }
};

// Bet/round endpoints
/**
 * Fetches the current round
 * @returns {Promise<any>}
 */
export const fetchCurrentRound = async () => {
  try {
    const response = await api.get('/bets/current');
    return response;
  } catch (err) {
    console.error('Fetch current round error:', err);
    const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch current round';
    throw new Error(errorMessage);
  }
};

/**
 * Fetches a bet result for a period
 * @param {string} period
 * @returns {Promise<any>}
 */
export const fetchBetResult = async (period) => {
  try {
    if (!period) {
      throw new Error('Period is required');
    }
    const response = await api.get(`/bets/result/${period}`);
    return response;
  } catch (err) {
    console.error('Fetch bet result error:', err);
    const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch bet result';
    throw new Error(errorMessage);
  }
};

/**
 * Fetches bet history
 * @returns {Promise<any[]>}
 */
export const fetchBets = async () => {
  try {
    const response = await api.get('/bets/history');
    return response;
  } catch (err) {
    console.error('Fetch bets error:', err);
    const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch bets';
    throw new Error(errorMessage);
  }
};

/**
 * Sets a manual round outcome
 * @param {string} period
 * @param {object} result
 * @returns {Promise<any>}
 */
export const setManualRoundOutcome = async (period, result) => {
  try {
    if (!period || !result) {
      throw new Error('Period and result are required');
    }
    const response = await api.post(`/bets/${period}/set-outcome`, result);
    return response.data.result;
  } catch (err) {
    console.error('Set manual round outcome error:', err);
    const errorMessage = err.response?.data?.error || err.message || 'Failed to set outcome';
    throw new Error(errorMessage);
  }
};


/**
 * Fetches a round result for a period (admin only)
 * @param {string} period
 * @returns {Promise<any|null>}
 */
export const fetchRoundResult = async (period) => {
  try {
    if (!period) {
      throw new Error('Period is required');
    }
    const cleanPeriod = period.startsWith('round-') ? period : `round-${period}`;
    console.log('Fetching round result for URL:', `${api.defaults.baseURL}/rounds/result/${cleanPeriod}`);
    const response = await api.get(`/rounds/result/${cleanPeriod}`);
    console.log('Round result fetched:', response);
    return response;
  } catch (err) {
    console.error('Fetch round result error:', {
      period,
      error: err.message,
      status: err.response?.status,
      responseData: err.response?.data,
    });
    if (err.response?.status === 404) {
      console.warn(`No round result for period: ${period}`);
      return null; // Return null for missing rounds
    }
    const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch round result';
    throw new Error(errorMessage);
  }
};

export default api;

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

const API_URL = process.env.REACT_APP_API_URL || 'https://your-backend-url.vercel.app';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('No adminToken found in localStorage');
  }
  return config;
});

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
export const adminSignup = async (email, password, adminKey) => {
  try {
    const response = await api.post('/api/auth/admin/signup', { email, password, adminKey });
    return response.data;
  } catch (err) {
    throw err.response?.data || { error: 'Signup failed' };
  }
};

export const adminLogin = async (email, password) => {
  try {
    const response = await api.post('/api/auth/admin/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('adminToken', response.data.token);
      console.log('adminToken saved:', response.data.token);
    }
    return response.data;
  } catch (err) {
    console.error('Login error:', err.response?.data);
    throw err.response?.data || { error: 'Login failed' };
  }
};

export const adminLogout = async () => {
  try {
    const response = await api.post('/api/auth/logout');
    localStorage.removeItem('adminToken');
    return response.data;
  } catch (err) {
    throw err.response?.data || { error: 'Logout failed' };
  }
};

// User endpoints
export const getAllUsers = async () => {
  try {
    const response = await api.get('/api/admin/users');
    return response.data;
  } catch (err) {
    throw err.response?.data || { error: 'Failed to fetch users' };
  }
};

export const editUser = async (userId, data) => {
  try {
    const response = await api.put(`/api/admin/users/${userId}`, data);
    return response.data;
  } catch (err) {
    throw err.response?.data || { error: 'Failed to edit user' };
  }
};

export const toggleBanUser = async (userId, status) => {
  try {
    const response = await api.put(`/api/admin/users/${userId}/status`, { status });
    return response.data;
  } catch (err) {
    throw err.response?.data || { error: 'Failed to update user status' };
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/api/admin/users/${userId}`);
    return response.data;
  } catch (err) {
    throw err.response?.data || { error: 'Failed to delete user' };
  }
};

// Bet/round endpoints
export const fetchCurrentRound = async () => {
  try {
    const response = await api.get('/api/bets/current');
    return response.data;
  } catch (err) {
    console.error('fetchCurrentRound error:', err.response?.data);
    throw err.response?.data || { error: 'Failed to fetch current round' };
  }
};

export const fetchBetResult = async (period) => {
  try {
    const response = await api.get(`/api/bets/result/${period}`);
    return response.data;
  } catch (err) {
    console.error('fetchBetResult error:', err.response?.data);
    throw err.response?.data || { error: 'Failed to fetch bet result' };
  }
};

export const fetchBets = async () => {
  try {
    const response = await api.get('/api/bets/history');
    return response.data;
  } catch (err) {
    console.error('fetchBets error:', err.response?.data);
    throw err.response?.data || { error: 'Failed to fetch bets' };
  }
};

export const setManualRoundOutcome = async (period, result) => {
  try {
    console.log('setManualRoundOutcome called:', { period, result });
    const response = await api.post(`/api/bets/${period}/set-outcome`, result);
    return response.data.result;
  } catch (err) {
    console.error('setManualRoundOutcome error:', err.response?.data);
    throw err.response?.data || { error: 'Failed to set outcome' };
  }
};

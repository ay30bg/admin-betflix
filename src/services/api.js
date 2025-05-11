// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'https://your-backend-url.vercel.app'; // Replace with your backend URL

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add token to requests
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('adminToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Log errors for debugging
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
//     return Promise.reject(error);
//   }
// );

// // Admin Signup
// export const adminSignup = async (email, password, adminKey) => {
//   try {
//     const response = await api.post('/api/auth/admin/signup', {
//       email,
//       password,
//       adminKey,
//     });
//     return response.data;
//   } catch (err) {
//     throw err.response?.data || { error: 'Signup failed' };
//   }
// };

// // Admin Login
// export const adminLogin = async (email, password) => {
//   try {
//     const response = await api.post('/api/auth/admin/login', {
//       email,
//       password,
//     });
//     return response.data;
//   } catch (err) {
//     throw err.response?.data || { error: 'Login failed' };
//   }
// };

// // Admin Logout
// export const adminLogout = async () => {
//   try {
//     const response = await api.post('/api/auth/logout');
//     return response.data;
//   } catch (err) {
//     throw err.response?.data || { error: 'Logout failed' };
//   }
// };

// // Other functions (adminForgotPassword, adminResetPassword, getAdminDashboard, getAllUsers, deleteUser, fetchBets, fetchCurrentRound, placeBet, fetchBetResult) remain unchanged

// // Admin Forgot Password
// export const adminForgotPassword = async (email) => {
//   try {
//     const response = await api.post('/api/auth/admin/forgot-password', { email });
//     return response.data;
//   } catch (err) {
//     throw err.response?.data || { error: 'Failed to send reset link' };
//   }
// };

// // Admin Reset Password
// export const adminResetPassword = async (token, email, password) => {
//   try {
//     const response = await api.post('/api/auth/admin/reset-password', {
//       token,
//       email,
//       password,
//     });
//     return response.data;
//   } catch (err) {
//     throw err.response?.data || { error: 'Failed to reset password' };
//   }
// };

// // Get Admin Dashboard
// export const getAdminDashboard = async () => {
//   try {
//     const response = await api.get('/api/admin/dashboard');
//     return response.data;
//   } catch (err) {
//     throw err.response?.data || { error: 'Failed to load dashboard' };
//   }
// };

// // Get All Users
// export const getAllUsers = async () => {
//   try {
//     const response = await api.get('/api/admin/users');
//     return response.data;
//   } catch (err) {
//     throw err.response?.data || { error: 'Failed to fetch users' };
//   }
// };

// // Delete User
// export const deleteUser = async (userId) => {
//   try {
//     const response = await api.delete(`/api/admin/users/${userId}`);
//     return response.data;
//   } catch (err) {
//     throw err.response?.data || { error: 'Failed to delete user' };
//   }
// };

// // Fetch Bets History
// export const fetchBets = async () => {
//   try {
//     const response = await api.get('/api/bets/history');
//     return response.data;
//   } catch (err) {
//     throw err.response?.data || { error: 'Failed to fetch bets' };
//   }
// };

// // Fetch Current Round
// export const fetchCurrentRound = async () => {
//   try {
//     const response = await api.get('/api/bets/current');
//     return response.data;
//   } catch (err) {
//     throw err.response?.data || { error: 'Failed to fetch current round' };
//   }
// };

// // Place Bet
// export const placeBet = async (betData) => {
//   try {
//     const response = await api.post('/api/bets', betData);
//     return response.data;
//   } catch (err) {
//     throw err.response?.data || { error: 'Failed to place bet' };
//   }
// };

// // Fetch Bet Result
// export const fetchBetResult = async (period) => {
//   try {
//     const response = await api.get(`/api/bets/result/${period}`);
//     return response.data;
//   } catch (err) {
//     throw err.response?.data || { error: 'Failed to fetch bet result' };
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
    return Promise.reject(error);
  }
);

// Admin Signup
export const adminSignup = async (email, password, adminKey) => {
  try {
    const response = await api.post('/api/auth/admin/signup', {
      email,
      password,
      adminKey,
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || { error: 'Signup failed' };
  }
};

// Admin Login
export const adminLogin = async (email, password) => {
  try {
    const response = await api.post('/api/auth/admin/login', {
      email,
      password,
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || { error: 'Login failed' };
  }
};

// Admin Logout
export const adminLogout = async () => {
  try {
    const response = await api.post('/api/auth/logout');
    return response.data;
  } catch (err) {
    throw err.response?.data || { error: 'Logout failed' };
  }
};

// Admin Forgot Password
export const adminForgotPassword = async (email) => {
  try {
    const response = await api.post('/api/auth/admin/forgot-password', { email });
    return response.data;
  } catch (err) {
    throw err.response?.data || { error: 'Failed to send reset link' };
  }
};

// Admin Reset Password
export const adminResetPassword = async (token, email, password) => {
  try {
    const response = await api.post('/api/auth/admin/reset-password', {
      token,
      email,
      password,
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || { error: 'Failed to reset password' };
  }
};

// Get Admin Dashboard
export const getAdminDashboard = async () => {
  try {
    const response = await api.get('/api/admin/dashboard');
    return response.data;
  } catch (err) {
    throw err.response?.data || { error: 'Failed to load dashboard' };
  }
};

// Get All Users
export const getAllUsers = async () => {
  try {
    const response = await api.get('/api/admin/users');
    return response.data;
  } catch (err) {
    throw err.response?.data || { error: 'Failed to fetch users' };
  }
};

// Edit User
export const editUser = async (userId, data) => {
  try {
    const response = await api.put(`/api/admin/users/${userId}`, data);
    return response.data;
  } catch (err) {
    throw err.response?.data || { error: 'Failed to edit user' };
  }
};

// Ban or Unban User
export const toggleBanUser = async (userId, status) => {
  try {
    const response = await api.put(`/api/admin/users/${userId}/status`, { status });
    return response.data;
  } catch (err) {
    throw err.response?.data || { error: 'Failed to update user status' };
  }
};

// Delete User
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/api/admin/users/${userId}`);
    return response.data;
  } catch (err) {
    throw err.response?.data || { error: 'Failed to delete user' };
  }
};

// Fetch Bets History
export const fetchBets = async () => {
  try {
    const response = await api.get('/api/bets/history');
    return response.data;
  } catch (err) {
    throw err.response?.data || { error: 'Failed to fetch bets' };
  }
};

// Fetch Current Round
export const fetchCurrentRound = async () => {
  try {
    const response = await api.get('/api/bets/current');
    return response.data;
  } catch (err) {
    throw err.response?.data || { error: 'Failed to fetch current round' };
  }
};

// Place Bet
export const placeBet = async (betData) => {
  try {
    const response = await api.post('/api/bets', betData);
    return response.data;
  } catch (err) {
    throw err.response?.data || { error: 'Failed to place bet' };
  }
};

// Fetch Bet Result
export const fetchBetResult = async (period) => {
  try {
    const response = await api.get(`/api/bets/result/${period}`);
    return response.data;
  } catch (err) {
    throw err.response?.data || { error: 'Failed to fetch bet result' };
  }
};

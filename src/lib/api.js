import { auth } from './firebase';

const BASE_URL = 'http://localhost:5000/api';

/**
 * Helper to fetch with JWT or Firebase ID Token
 */
export const apiRequest = async (endpoint, options = {}) => {
  let token = localStorage.getItem('token');
  
  if (!token) {
    const user = auth.currentUser;
    if (user) {
      token = await user.getIdToken();
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

export const phoneAuth = (data) => apiRequest('/auth/phone', {
  method: 'POST',
  body: JSON.stringify(data)
});

export const loginAdmin = (credentials) => apiRequest('/auth/admin/login', {
  method: 'POST',
  body: JSON.stringify(credentials)
});

// --- Predictions ---
export const getConstituencies = () => apiRequest('/predictions/constituencies');
export const getMyPredictions = () => apiRequest('/predictions/my-predictions');
export const submitPrediction = (data) => apiRequest('/predictions/submit', {
  method: 'POST',
  body: JSON.stringify(data),
});

// --- User ---
export const getMe = () => apiRequest('/users/me');
export const getMyStats = () => apiRequest('/users/me/stats');
export const getLeaderboard = () => apiRequest('/users/leaderboard');
export const updateProfile = (data) => apiRequest('/users/me/profile', {
  method: 'PUT',
  body: JSON.stringify(data)
});
export const changePassword = (data) => apiRequest('/users/me/password', {
  method: 'PUT',
  body: JSON.stringify(data)
});
export const deleteAccount = () => apiRequest('/users/me', { method: 'DELETE' });

// --- Notifications ---
export const getNotifications = () => apiRequest('/notifications');
export const markNotificationRead = (id) => apiRequest(`/notifications/${id}/read`, { method: 'PUT' });
export const markAllNotificationsRead = () => apiRequest('/notifications/read-all', { method: 'POST' });
export const deleteNotification = (id) => apiRequest(`/notifications/${id}`, { method: 'DELETE' });
export const deleteAllNotifications = () => apiRequest('/notifications', { method: 'DELETE' });

// --- Admin / System ---
export const getPhaseConfig = () => apiRequest('/admin/config');
export const getAdminStats = () => apiRequest('/admin/stats');
export const updateAdminConfig = (data) => apiRequest('/admin/config', {
  method: 'PUT',
  body: JSON.stringify(data)
});

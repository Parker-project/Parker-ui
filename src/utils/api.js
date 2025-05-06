import { API_BASE_URL } from '../constants/api';


const getToken = () => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    return userData.token;
  }
  return null;
};

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const apiRequest = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
    credentials: 'include',
    mode: 'cors',
  });

  // Handle 401 Unauthorized
  if (response.status === 401) {
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const login = async (email, password, rememberMe) => {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, rememberMe }),
  });
  
  if (data.token) {
    localStorage.setItem('user', JSON.stringify(data));
  }
  
  return data;
};

export const logout = async () => {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } finally {
    localStorage.removeItem('user');
  }
};

export const submitReport = async (reportData) => {
  return apiRequest('/reports', {
    method: 'POST',
    body: JSON.stringify(reportData),
  });
};

export const getReports = async (userId) => {
  const endpoint = userId ? `/reports/${userId}` : '/reports';
  return apiRequest(endpoint);
};
import { API_BASE_URL } from '../constants/api';

let handleSessionExpired;
try {
  // Dynamic import to avoid circular dependency
  import('../App').then(module => {
    handleSessionExpired = module.handleSessionExpired;
  });
} catch (error) {
  console.warn('Could not import handleSessionExpired');
}

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
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
      credentials: 'include',
      mode: 'cors',
    });

    // Handle 401 Unauthorized - but don't redirect if trying to login
    if (response.status === 401) {
      // Only clear user data and redirect for authenticated endpoints,
      // not for the login endpoint itself
      if (!endpoint.includes('/auth/login')) {
        localStorage.removeItem('user');
        // Fire the session expired event if available
        if (handleSessionExpired) {
          handleSessionExpired();
        } else {
          // Fallback to custom event if handler not loaded
          const event = new CustomEvent('session_expired');
          window.dispatchEvent(event);
        }
        throw new Error('SESSION_EXPIRED');
      } else {
        // For login endpoint, just throw the error to be handled by login form
        const data = await response.json();
        throw new Error(data.message || 'Invalid credentials');
      }
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    // If it's a session expired error, we've already handled it above
    if (error.message === 'SESSION_EXPIRED') {
      throw error;
    }
    
    // For network errors or other issues
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error. Please check your connection.');
    }
    
    throw error;
  }
};

export const login = async (email, password, rememberMe) => {
  try {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, rememberMe }),
    });
    
    if (data.token) {
      localStorage.setItem('user', JSON.stringify(data));
    }
    
    return data;
  } catch (error) {
    throw error;
  }
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
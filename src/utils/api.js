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

    // For non-JSON responses (like file uploads), return the response directly
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response;
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
  try {
    return apiRequest('/reports', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  } catch (error) {
    throw error;
  }
};

export const getReports = async (userId) => {
  const endpoint = userId ? `/reports/${userId}` : '/reports';
  return apiRequest(endpoint);
};
export const getUserProfile = async () => {
  try {
    try {
      const response = await apiRequest('/user/profile');
      return response;
    } catch (profileError) {
      // If user/profile fails, try auth/me as a fallback
      const response = await apiRequest('/auth/me');

      return response;
    }
  } catch (error) {
    console.error('Authentication check failed with both endpoints:', error);
    
    if (error.message === 'Failed to fetch') {
      console.warn('Network error - server might be down or unavailable');
    }
    
    throw error;
  }
};

// OCR
/**
 * Sends an image to the OCR service to extract license plate number
 * @param {File} imageFile - The image file (jpeg, jpg, or png)
 * @returns {Promise<Object>} - The OCR response with extracted license plate
 */
export const detectLicensePlate = async (imageFile) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!validTypes.includes(imageFile.type)) {
    throw new Error('Invalid file type. Please upload a JPEG or PNG image.');
  }
  
  const formData = new FormData();
  formData.append('image', imageFile, imageFile.name || 'image.jpg');
  
  try {
    const response = await fetch(`${API_BASE_URL}/ocr/license-plate`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      mode: 'cors'
    });
    
    const responseText = await response.text();
    
    if (!response.ok) {
      if (responseText.startsWith('{') && responseText.endsWith('}')) {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.message || `OCR failed with status: ${response.status}`);
      }
      throw new Error(`OCR service error (${response.status}): ${responseText || response.statusText}`);
    }
    
    if (!responseText || responseText.trim() === '') {
      throw new Error('The OCR service returned an empty response. Please try a different image.');
    }
    
    try {
      return JSON.parse(responseText);
    } catch (jsonError) {
      if (/^[a-zA-Z0-9-]+$/.test(responseText.trim())) {
        return { 
          success: true,
          licensePlate: {
            plate: responseText.trim(),
            score: 1.0
          }
        };
      }
      throw new Error('Unable to read the OCR service response. Please try again with a clearer image.');
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Extracts the license plate number from OCR results
 * @param {Object} ocrResults - The results from the OCR API
 * @returns {string|null} - The detected license plate or null if not found/invalid
 */
export const getHighestConfidencePlate = (ocrResults) => {
  if (!ocrResults || typeof ocrResults !== 'object') {
    return null;
  }

  // Handle the standard response format
  if (ocrResults.success && ocrResults.licensePlate?.plate) {
    const plate = ocrResults.licensePlate.plate;
    return /^\d{6,8}$/.test(plate) ? plate : null;
  }

  // Handle direct plate in root (fallback)
  if (ocrResults.plate) {
    const plate = ocrResults.plate;
    return /^\d{6,8}$/.test(plate) ? plate : null;
  }

  return null;
};

export const getAllReports = async => {
  const endpoint = `/reports`;
  return apiRequest(endpoint);
};


export const getAllUsers = async => {
  const endpoint = `/reports`;
  return apiRequest(endpoint);
};

export const updateReportStatus = async (reportId, newStatus) => {
  const endpoint = `/reports/${reportId}/status`;
  console.log('Updating report status:', endpoint, newStatus);

  const res = await apiRequest(endpoint, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: newStatus }),
  });

  console.log('Response from updateReportStatus:', res);
  // res is already the parsed response (likely the updated report object or a success message)
  return res;
};


export const updateUserRole = async (userId, newRole) => {
  const endpoint = `/users/${reportId}/role`;
  const res = await apiRequest(endpoint, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role: newRole }),
  });

  if (!res.ok) throw new Error('Failed to update users role');

  return await res.json();
}
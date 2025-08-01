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
    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.token;
    } catch (error) {
      return null;
    }
  }
  return null;
};

const getHeaders = (options) => {
  const token = getToken();
  return {
    ...(!(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const apiRequest = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(options),
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
    } else {
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

// Convert file to base64 data URL
const fileToDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
};

export const storeImagesLocally = async (imageFiles) => {
  try {
    const storedImages = [];
    
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const dataURL = await fileToDataURL(file);
      const imageId = `parker_image_${Date.now()}_${i}`;
      
      localStorage.setItem(`image_${imageId}`, dataURL);
      
      storedImages.push(imageId);
    }
    
    return storedImages;
  } catch (error) {
    console.error('Error storing images locally:', error);
    throw new Error('Failed to store images locally');
  }
};

export const submitReport = async (reportData) => {
  try {
    const payload = {};
    
    if(reportData.userId) {
      payload.userId = reportData.userId;
    }

    if(reportData.location) {
      payload.location = reportData.location;
    }

    // Store images locally and use the IDs as paths
    if (reportData.images && reportData.images.length > 0) {
      const imageIds = await storeImagesLocally(reportData.images);
      payload.images = imageIds;
    }

    payload.liscensePlateNumber = reportData.liscensePlateNumber;
    payload.description = reportData.description;

    return apiRequest('/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
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


export const updateReportStatus = async (reportId, newStatus) => {
  const endpoint = `/reports/${reportId}/status`;

  const res = await apiRequest(endpoint, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: newStatus }),
  });
  // res is already the parsed response (likely the updated report object or a success message)
  return res;
};


export const updateUserRole = async (userId, newRole) => {
  const endpoint = `/user/${userId}/role`;
  const res = await apiRequest(endpoint, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role: newRole }),
  });

  // res is already parsed JSON
  return res;
}


export const getAllUsers = async => {
  const endpoint = `/user`;
  const res = apiRequest(endpoint);
  return res;
};


export const deleteUser = async (userId) => {
  const res = await apiRequest(`/user/${userId}`, {
    method: 'DELETE',
  });
};


export const updateReportInspector = async (reportId, newInspectorId) => {
  const endpoint = `/reports/${reportId}/assign-inspector`;

  const res = await apiRequest(endpoint, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inspectorId: newInspectorId }),
  });
  return res;
};

export const getUserById = async (userId) => {
  const endpoint = `/user/${userId}`;
  const res = await apiRequest(endpoint);
  return res;
}

export const getUserByRole = async (userRole) => {
  const endpoint = `/user/role/${userRole}`;
  return apiRequest(endpoint);
};

export const deleteReportById = async (reportId) => {
  const endpoint = `/reports/${reportId}`;

  const res = await apiRequest(endpoint, {
    method: 'DELETE',
  });
  return res;
};


export const getInspectorReports = async (user) => {
  const endpoint = `/reports/inspector/${user.id}`;
  const res = await apiRequest(endpoint, {
    method: 'GET',
  });
  return res;
};
// Base API configuration and utilities
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Default headers
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// API client class
class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Get headers with authentication
  getHeaders(customHeaders = {}) {
    const headers = { ...defaultHeaders, ...customHeaders };
    
    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.headers),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle different response types
      if (!response.ok) {
        const errorData = await this.parseResponse(response);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await this.parseResponse(response);
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Parse response based on content type
  async parseResponse(response) {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  }

  // HTTP methods
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // File upload
  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add additional form data
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
    });
  }
}

// Create a default instance
export const api = new ApiClient();

// Export the class for custom instances
export { ApiClient };

// Common API endpoints
export const endpoints = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  VERIFY_TOKEN: '/auth/verify',
  
  // Users
  USERS: '/users',
  USER_PROFILE: '/users/profile',
  
  // Dashboard
  DASHBOARD_STATS: '/dashboard/stats',
  
  // Add more endpoints as needed
};

// Common error handler
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  // Handle specific error cases
  if (error.message.includes('401')) {
    // Unauthorized - clear auth data and redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  
  return {
    error: true,
    message: error.message || 'An unexpected error occurred',
  };
};

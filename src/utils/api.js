import axios from "axios";

// Create an Axios instance with base URL and default headers
const api = axios.create({
  baseURL: "http://localhost:8082", // Base URL of your API
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    
    // Log cart-related requests
    if (config.url?.includes('/cart') || config.url?.includes('/order')) {
      console.log('Cart/Order Request:', {
        url: config.url,
        method: config.method,
        data: config.data
      });
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle responses and errors globally
api.interceptors.response.use(
  (response) => {
    // Add logging for successful responses
    console.log(`API Response [${response.config.method}] ${response.config.url}:`, response.data);
    
    // Additional logging for cart/order responses
    if (response.config.url?.includes('/cart') || response.config.url?.includes('/order')) {
      console.log('Cart/Order Response Data:', {
        status: response.status,
        data: response.data,
        headers: response.headers
      });
    }
    
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with error status
      console.error('Response error:', {
        status: error.response.status,
        data: error.response.data,
        endpoint: error.config.url,
        method: error.config.method
      });
      
      // Additional cart/order error logging
      if (error.config.url?.includes('/cart') || error.config.url?.includes('/order')) {
        console.error('Cart/Order Operation Failed:', {
          requestData: error.config.data,
          responseError: error.response.data
        });
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error:', error.request);
    } else {
      // Something else happened while setting up the request
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;

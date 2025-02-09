import axios from "axios";

// Create an Axios instance with base URL and default headers
const api = axios.create({
  baseURL: "http://localhost:8082", // Base URL of your API
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Attach token to requests if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

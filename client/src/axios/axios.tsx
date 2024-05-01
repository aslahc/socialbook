import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000'; // Set your base URL here

const axiosInstance = axios.create({
  baseURL,
});

// Add a request interceptor to include the JWT token in the headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

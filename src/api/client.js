import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to log HTTP status codes during development
client.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[API ${response.config.method?.toUpperCase()}] ${response.config.url} - Status: ${response.status}`);
    }
    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error(
        `[API ${error.config?.method?.toUpperCase()}] ${error.config?.url} - Status: ${error.response?.status || 'Network Error'} - ${error.response?.data?.message || error.message}`
      );
    }
    return Promise.reject(error);
  }
);

export default client;

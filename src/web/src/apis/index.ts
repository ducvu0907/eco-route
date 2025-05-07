import { apiUrl } from '@/config/config';
import { useToast } from '@/hooks/useToast';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const storedAuth = localStorage.getItem("auth");
      const token = storedAuth ? JSON.parse(storedAuth).token : null;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error parsing auth token from localStorage", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { showToast } = useToast();
    if (!error.response) {
      showToast('Network error. Please check your connection.', "error");
    } else {
      const { data } = error.response;
      showToast(data?.message || 'An unknown error occurred', "error");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

import { apiUrl } from '@/config/config';
import { useToast } from '@/hooks/useToast';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      showToast("Network error", "error");
    } else {
      const { data } = error.response;
      showToast(data?.message || 'An unknown error occurred', "error");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

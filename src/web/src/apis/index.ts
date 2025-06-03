// import { apiUrl } from '@/config/config';
import { useToast } from '@/hooks/useToast';
import { ApiResponse } from '@/types/types';
import axios, { AxiosResponse } from 'axios';

const axiosInstance = axios.create({
  baseURL: "/api", // use this to let nginx routing
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
  (response: AxiosResponse<ApiResponse<unknown>, unknown>) => {
    const { showToast } = useToast();
    showToast(response.data.message, "success");
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

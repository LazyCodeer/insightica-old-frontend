import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('insightica_access_token');
    if (accessToken) {
      config.headers.Authorization = `JWT ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('insightica_refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/token/refresh/`, {
            refresh: refreshToken,
          });
          const { access, refresh } = response.data;
          localStorage.setItem('insightica_access_token', access);
          if (refresh) {
            localStorage.setItem('insightica_refresh_token', refresh);
          }
          apiClient.defaults.headers.common['Authorization'] = `JWT ${access}`;
          originalRequest.headers['Authorization'] = `JWT ${access}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh token failed, logout user
          localStorage.removeItem('insightica_access_token');
          localStorage.removeItem('insightica_refresh_token');
          localStorage.removeItem('insighticaUser');
          delete apiClient.defaults.headers.common['Authorization'];
          // Redirect to login page
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

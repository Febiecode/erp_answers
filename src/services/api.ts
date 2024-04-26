import axios from 'axios';

const api = axios.create({
  baseURL: 'https://erpanswers-dev.hostedapp.in/',
  // Other configurations like headers can be added here
});

// Add a request interceptor to include the token in each request
api.interceptors.request.use(
  config => {

    const token = localStorage.getItem('token');; // Replace with your actual token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api;
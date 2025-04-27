// import axios from 'axios';


// const api = axios.create({
//   baseURL: 'http://localhost:8000',
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });




// // Request interceptor for API calls
// api.interceptors.request.use(
//   async config => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers = {
//         ...config.headers,
//         Authorization: `Bearer ${token}`,
//       };
//     }
//     return config;
//   },
//   error => {
//     Promise.reject(error);
//   }
// );

// // Response interceptor for API calls
// api.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config;

//     // Handle token refresh or redirect to login on auth errors
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       // Handle token refresh logic here if needed

//       // For now, just redirect to login
//       localStorage.removeItem('token');
//       localStorage.removeItem('userData');
//       window.location.href = '/login';
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;


// lib/axios.js
import axios from 'axios';

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000', // Adjust this to your actual API URL
  timeout: 15000, // Set a reasonable timeout
  headers: {
    'Content-Type': 'application/json',
  },
  // Add withCredentials to handle cookies properly
  withCredentials: true,
});

// Add a request interceptor to attach the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check for specific error conditions
    if (error.response?.status === 401) {
      // Unauthorized - token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('userData');

      // Optional: Redirect to login page
      // window.location.href = '/auth';
    }

    return Promise.reject(error);
  }
);

export default api;
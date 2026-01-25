import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// API Base URL - Change this to your production URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-backend-url.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Error getting token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, logout user
      await SecureStore.deleteItemAsync('token');
      // Navigate to login
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (name: string, email: string, password: string, phone: string) =>
    api.post('/auth/register', { name, email, password, phone }),
  
  loginWithPin: (email: string, pin: string) =>
    api.post('/auth/pin/login', { email, pin }),
  
  setupPin: (pin: string) =>
    api.post('/auth/pin/setup', { pin }),
  
  checkPin: (email: string) =>
    api.get(`/auth/check-pin/${encodeURIComponent(email)}`),
  
  getProfile: () => api.get('/auth/me'),
};

// Schools API
export const schoolsAPI = {
  getAll: () => api.get('/schools'),
  getById: (id: string) => api.get(`/schools/${id}`),
  getCourses: (schoolId: string) => api.get(`/schools/${schoolId}/courses`),
};

// Transport API
export const transportAPI = {
  getRoutes: () => api.get('/transport/routes'),
};

// Services API
export const servicesAPI = {
  getAgencies: () => api.get('/services/agencies'),
};

// Enrollments API
export const enrollmentsAPI = {
  getAll: () => api.get('/enrollments'),
  create: (data: any) => api.post('/enrollments', data),
};

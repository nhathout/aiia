import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Interceptor: skipAuth flag prevents adding Authorization header
api.interceptors.request.use((cfg: any) => {
  if (!cfg.skipAuth) {
    const token = localStorage.getItem('token');
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

// --- AUTH (no Authorization header) ---
export const signup = (name:string, email:string, password:string) =>
  api.post('/auth/signup', { name, email, password }, { skipAuth: true });

export const login  = (email:string, password:string) =>
  api.post('/auth/login',  { email, password },        { skipAuth: true });

export const fetchProfile = () =>
  api.get('/auth/me');     // returns { id,email,name,preferences,... }

// --- MAIN ENDPOINTS ---
export const recommend     = (payload:any) => api.post('/recommend', payload);
export const getHistory    = ()             => api.get('/recommend');
export const updateProfile = (data:any)    => api.put('/profile', data);

export default api;
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const signup   = (name:string, email:string, password:string) =>
  api.post('/auth/signup', { name, email, password });

export const login    = (email:string, password:string) =>
  api.post('/auth/login',  { email, password });

export const recommend = (tok:string, data:any) =>
  api.post('/recommend', data, { headers:{ Authorization:`Bearer ${tok}` } });

export const getPortfolio = (tok:string) =>
  api.get('/portfolio',        { headers:{ Authorization:`Bearer ${tok}` } });

export const getHistory   = (tok:string) =>
  api.get('/portfolio/history',{ headers:{ Authorization:`Bearer ${tok}` } });
// frontend/src/api.ts
import axios from "axios";

const api = axios.create({ baseURL: "/api" });

/* ───────────────────────── request interceptor ───────────────────────── */
api.interceptors.request.use((cfg: any) => {
  if (!cfg.skipAuth) {
    const token = localStorage.getItem("token");
    if (token) cfg.headers.Authorization = `Bearer ${token}`;  // ← back-ticks
  }
  return cfg;
});

/* ────────────────────────── AUTH ───────────────────────── */
export const signup = (name: string, email: string, password: string) =>
  api.post("/auth/signup", { name, email, password }, { skipAuth: true });

export const login = (email: string, password: string) =>
  api.post("/auth/login", { email, password }, { skipAuth: true });

export const fetchProfile = () => api.get("/auth/me");

/* ───────────────────────── MAIN ───────────────────────── */
export const recommend    = (payload: any) => api.post("/recommend", payload);
export const getHistory   = ()             => api.get("/recommend");
export const updateProfile = (data: any)   => api.put("/profile", data);

export default api;
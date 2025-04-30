import React, { createContext, useState, useEffect } from 'react';
import { fetchProfile } from './services/api';

interface AuthCtxType {
  token: string | null;
  setToken: (tok: string | null) => void;
  user: any;
  setUser: (u: any) => void;
}

export const AuthCtx = createContext<AuthCtxType>({
  token: null,
  setToken: () => {},
  user: null,
  setUser: () => {},
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() =>
    localStorage.getItem('token')
  );
  const [user, setUser] = useState<any>(null);

  const setToken = (tok: string | null) => {
    if (tok) {
      localStorage.setItem('token', tok);
    } else {
      localStorage.removeItem('token');
    }
    setTokenState(tok);
  };

  useEffect(() => {
    if (token) {
      fetchProfile().then(res => setUser(res.data));
    } else {
      setUser(null);
    }
  }, [token]);

  return (
    <AuthCtx.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AuthCtx.Provider>
  );
}
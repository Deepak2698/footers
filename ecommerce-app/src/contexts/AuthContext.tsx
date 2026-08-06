import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import * as authService from '../services/authService';

type User = { id: string; name: string; email: string; role: string } | null;

type AuthContextType = {
  user: User;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<User>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function init() {
      const saved = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (saved) {
        setToken(saved);
        api.defaults.headers.common.Authorization = `Bearer ${saved}`;
        try {
          const res = await authService.profile();
          if (res && res.data) setUser(res.data);
        } catch (err) {
          // invalid token, clear
          setUser(null);
          setToken(null);
          localStorage.removeItem('authToken');
          sessionStorage.removeItem('authToken');
          delete api.defaults.headers.common.Authorization;
        }
      }
      setLoading(false);
    }
    init();
  }, []);

  const login = async (email: string, password: string, remember = false) => {
    const res = await authService.login(email, password);
    if (res && res.token) {
      const t = res.token as string;
      setToken(t);
      api.defaults.headers.common.Authorization = `Bearer ${t}`;
      if (remember) localStorage.setItem('authToken', t); else sessionStorage.setItem('authToken', t);
      if (res.data) {
        setUser(res.data);
        return res.data;
      }
    }
    throw new Error('Login failed');
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // ignore
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    delete api.defaults.headers.common.Authorization;
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

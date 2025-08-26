/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type AuthUser = {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  password2: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isAuthOpen: boolean;
  openAuth: () => void;
  closeAuth: () => void;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'appetit_auth_user_v1';
const TOKEN_STORAGE_KEY = 'appetit_access_token_v1';
const API_BASE = 'http://127.0.0.1:8080/api/api/v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
      const t = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (t) setToken(t);
    } catch {
      /* ignore storage errors */
    }
  }, []);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(LOCAL_STORAGE_KEY);
      if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
      else localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      /* ignore storage errors */
    }
  }, [user, token]);

  const openAuth = useCallback(() => setIsAuthOpen(true), []);
  const closeAuth = useCallback(() => setIsAuthOpen(false), []);

  const login = useCallback(async ({ email, password }: LoginPayload) => {
    if (!email || !password) throw new Error('Введите email и пароль');
    const res = await fetch(`${API_BASE}/users/authorize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      let message = 'Не удалось авторизоваться';
      try {
        const err: unknown = await res.json();
        if (typeof err === 'object' && err && 'detail' in err) {
          const d = (err as { detail?: Array<{ msg?: string }> }).detail;
          if (Array.isArray(d) && d[0]?.msg) message = d[0].msg as string;
        }
      } catch {
        /* ignore parse error */
      }
      throw new Error(message);
    }
    const data: { access_token: string } = await res.json();
    setToken(data.access_token);
    // API не возвращает профиль, сохраняем базу из email
    setUser({ id: 'self', username: email, email });
    setIsAuthOpen(false);
  }, []);

  const register = useCallback(async ({ firstName, lastName, email, password, password2 }: RegisterPayload) => {
    if (!firstName || !lastName || !email || !password || !password2) {
      throw new Error('Заполните все поля');
    }
    if (password !== password2) throw new Error('Пароли не совпадают');
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },
      body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password, password_2: password2 })
    });
    if (!res.ok) {
      let message = 'Не удалось зарегистрироваться';
      try {
        const err: unknown = await res.json();
        if (typeof err === 'object' && err && 'detail' in err) {
          const d = (err as { detail?: Array<{ msg?: string }> }).detail;
          if (Array.isArray(d) && d[0]?.msg) message = d[0].msg as string;
        }
      } catch {
        /* ignore parse error */
      }
      throw new Error(message);
    }
    const u: { id: number; email: string; first_name: string; last_name: string } = await res.json();
    setUser({ id: String(u.id), username: u.email, email: u.email, firstName: u.first_name, lastName: u.last_name });
    setIsAuthOpen(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(() => ({ user, token, isAuthOpen, openAuth, closeAuth, login, register, logout }), [user, token, isAuthOpen, openAuth, closeAuth, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

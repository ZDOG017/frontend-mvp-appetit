/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useToast } from './ToastContext';

export type AuthUser = {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  isAdmin?: boolean;
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
  isLoading: boolean;
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
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
      const t = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (t) setToken(t);
    } catch {
      /* ignore storage errors */
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

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

  const loadProfile = useCallback(async (overrideToken?: string) => {
    const t = overrideToken ?? token;
    if (!t) return;
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        method: 'GET',
        headers: { 'accept': 'application/json', 'Authorization': `Bearer ${t}` }
      });
      if (!res.ok) throw new Error('Не удалось получить профиль');
      const me: { id: number; email: string; first_name: string; last_name: string; is_admin?: boolean } = await res.json();
      setUser({
        id: String(me.id),
        username: me.email,
        email: me.email,
        firstName: me.first_name,
        lastName: me.last_name,
        isAdmin: me.is_admin,
      });
    } catch {
      // keep minimal handling; don't drop session on transient failures
    }
  }, [token]);

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
    await loadProfile(data.access_token);
    setIsAuthOpen(false);
    showToast({ title: 'Вы вошли в аккаунт', description: 'Добро пожаловать!', type: 'success' });
  }, [showToast, loadProfile]);

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
    showToast({ title: 'Регистрация успешна', description: 'Вы вошли в аккаунт', type: 'success' });
  }, [showToast]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    showToast({ title: 'Вы вышли из аккаунта', type: 'info' });
  }, [showToast]);

  // Try to fetch profile when token becomes available (e.g., after reload)
  useEffect(() => {
    if (token && !user) {
      loadProfile();
    }
  }, [token, user, loadProfile]);

  const value = useMemo(() => ({ user, token, isLoading, isAuthOpen, openAuth, closeAuth, login, register, logout }), [user, token, isLoading, isAuthOpen, openAuth, closeAuth, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

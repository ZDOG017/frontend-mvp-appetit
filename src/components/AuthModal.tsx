import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Input: React.FC<{
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  required?: boolean;
}> = ({ label, name, type = 'text', value, onChange, autoComplete, required }) => (
  <label className="block">
    <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
    <input
      name={name}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoComplete={autoComplete}
      required={required}
      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition"
    />
  </label>
);

const PasswordStrength: React.FC<{ password: string }> = ({ password }) => {
  const score = useMemo(() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[a-z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return Math.min(4, s - 1);
  }, [password]);
  const colors = ['bg-red-400', 'bg-yellow-400', 'bg-emerald-400', 'bg-green-500'];
  return (
    <div className="mt-2">
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-300 ${colors[score] || 'bg-red-400'}`} style={{ width: `${((score + 1) / 4) * 100}%` }} />
      </div>
      <p className="text-xs text-gray-500 mt-1">Пароль {password.length < 8 ? 'короткий' : 'приемлемый'}</p>
    </div>
  );
};

const AuthModal: React.FC = () => {
  const { isAuthOpen, closeAuth, login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);

  const [emailLogin, setEmailLogin] = useState('');
  const [password, setPassword] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  useEffect(() => {
    if (!isAuthOpen) return;
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') closeAuth(); };
    window.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onEsc); document.body.style.overflow = ''; };
  }, [isAuthOpen, closeAuth]);

  const handleLogin = useCallback(async () => {
    try {
      setError(null);
      await login({ email: emailLogin, password });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ошибка входа';
      setError(msg);
    }
  }, [login, emailLogin, password]);

  const handleRegister = useCallback(async () => {
    try {
      setError(null);
      if (password1 !== password2) {
        setError('Пароли не совпадают');
        return;
      }
      await register({ firstName, lastName, email, password: password1, password2 });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ошибка регистрации';
      setError(msg);
    }
  }, [register, firstName, lastName, email, password1, password2]);

  if (!isAuthOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeAuth} />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">{tab === 'login' ? 'Вход' : 'Регистрация'}</h3>
              <button onClick={closeAuth} aria-label="Закрыть" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 bg-gray-100 rounded-xl p-1">
              <button onClick={() => setTab('login')} className={`py-2 rounded-lg font-medium transition ${tab==='login'?'bg-white shadow text-gray-900':'text-gray-600 hover:text-gray-900'}`}>Вход</button>
              <button onClick={() => setTab('register')} className={`py-2 rounded-lg font-medium transition ${tab==='register'?'bg-white shadow text-gray-900':'text-gray-600 hover:text-gray-900'}`}>Регистрация</button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100">{error}</div>
            )}

            {tab === 'login' ? (
              <>
                <Input label="Email" name="email" type="email" value={emailLogin} onChange={setEmailLogin} autoComplete="email" required />
                <Input label="Пароль" name="password" type="password" value={password} onChange={setPassword} autoComplete="current-password" required />
                <button onClick={handleLogin} className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl shadow-lg transition">Войти</button>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Имя" name="firstName" value={firstName} onChange={setFirstName} autoComplete="given-name" required />
                  <Input label="Фамилия" name="lastName" value={lastName} onChange={setLastName} autoComplete="family-name" required />
                </div>
                <Input label="Email" name="email" type="email" value={email} onChange={setEmail} autoComplete="email" required />
                <Input label="Пароль" name="new-password" type="password" value={password1} onChange={setPassword1} autoComplete="new-password" required />
                <PasswordStrength password={password1} />
                <Input label="Повторите пароль" name="confirm-password" type="password" value={password2} onChange={setPassword2} autoComplete="new-password" required />
                <button onClick={handleRegister} className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl shadow-lg transition">Зарегистрироваться</button>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 text-sm text-gray-500">
            <p>
              Нажимая “{tab === 'login' ? 'Войти' : 'Зарегистрироваться'}”, вы соглашаетесь с условиями сервиса и политикой конфиденциальности.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

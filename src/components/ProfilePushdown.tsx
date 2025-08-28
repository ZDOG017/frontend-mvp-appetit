import React, { useCallback, useEffect, useRef } from 'react';
import type { AuthUser } from '../context/AuthContext';

type ProfileAction = {
  key: string;
  label: string;
  onClick: () => void;
};

const Avatar: React.FC<{ name?: string }>
  = ({ name }) => {
  const initials = (name || '').trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'A';
  return (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-500 text-white flex items-center justify-center font-semibold shadow-lg">
      {initials}
    </div>
  );
};

const useOutsideAndEsc = (ref: React.RefObject<HTMLElement | null>, onClose: () => void) => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) onClose();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [ref, onClose]);
};

const SectionHeader: React.FC<{ title: string; subtitle?: string }>
  = ({ title, subtitle }) => (
  <div className="mb-3">
    <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
    {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
  </div>
);

const Divider: React.FC = () => (
  <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4" />
);

const ProfilePushdown: React.FC<{
  user: AuthUser;
  isOpen: boolean;
  onClose: () => void;
  actions: ProfileAction[];
}>
  = ({ user, isOpen, onClose, actions }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useOutsideAndEsc(containerRef, onClose);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username;

  if (!isOpen) return null;

  return (
    <div
      className="absolute left-0 right-0 top-full z-[120]"
      role="dialog"
      aria-modal="true"
      aria-label="Панель профиля"
      onKeyDown={handleKeyDown}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end">
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-[0_12px_40px_-12px_rgba(0,0,0,0.25)] mt-2.5 max-h-[60vh] w-fit min-w-[320px] max-w-[min(92vw,640px)]"
          >
          {/* Top accent bar */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-fuchsia-500" />

          <div className="p-4 sm:p-5 overflow-y-auto">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="scale-75 origin-left"><Avatar name={fullName} /></div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-900">{fullName}</p>
                  {user.email && <p className="text-[10px] sm:text-[11px] text-gray-500">{user.email}</p>}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                aria-label="Закрыть панель профиля"
                tabIndex={0}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <Divider />

            {/* Actions grid */}
            <SectionHeader title="Ваш аккаунт" subtitle="Быстрый доступ к разделам" />
            <div className="grid grid-cols-1 gap-2.5">
              {actions.map((action) => (
                <button
                  key={action.key}
                  onClick={action.onClick}
                  className="group w-full text-left p-2 rounded-lg border border-gray-200 bg-white hover:border-red-300 hover:bg-red-50 transition focus:outline-none focus:ring-4 focus:ring-red-500/20"
                  tabIndex={0}
                  aria-label={action.label}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-800 group-hover:text-red-600">{action.label}</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                  </div>
                </button>
              ))}
            </div>

            <Divider />

            {/* Loyalty / perks - compact chips */}
            <div className="flex flex-nowrap items-center gap-1.5 whitespace-nowrap overflow-x-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-red-700">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Кэшбэк 5%
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-amber-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Статус Gold
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500" /> Баллы: 340
              </span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePushdown;



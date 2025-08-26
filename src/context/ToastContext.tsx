/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export type Toast = {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
  durationMs?: number;
};

export type ToastContextType = {
  showToast: (t: Omit<Toast, 'id'>) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

const DEFAULT_DURATION = 4000;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, durationMs: DEFAULT_DURATION, type: 'success', ...t }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-[1100] space-y-3 w-full max-w-sm">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  const { title, description, type = 'success', durationMs = DEFAULT_DURATION } = toast;
  const [progress, setProgress] = useState(100);
  const [paused, setPaused] = useState(false);
  const lastTickRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear any previous interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (paused) {
      lastTickRef.current = null;
      return;
    }
    // Start interval timer
    intervalRef.current = window.setInterval(() => {
      const now = performance.now();
      if (lastTickRef.current == null) {
        lastTickRef.current = now;
        return;
      }
      const elapsed = now - lastTickRef.current;
      lastTickRef.current = now;
      const deltaPct = (elapsed / durationMs) * 100;
      setProgress((p) => {
        const next = Math.max(0, p - deltaPct);
        if (next <= 0) {
          // Auto close when finished
          setTimeout(onClose, 0);
        }
        return next;
      });
    }, 80);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      lastTickRef.current = null;
    };
  }, [paused, durationMs, onClose]);

  const colorByType = type === 'error' ? 'bg-red-500' : type === 'info' ? 'bg-blue-500' : 'bg-green-500';

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="status"
      aria-live="polite"
    >
      <div className="p-4 pr-10">
        <div className="flex items-start space-x-3">
          <div className={`mt-1 h-2 w-2 rounded-full ${colorByType}`} />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">{title}</p>
            {description && <p className="text-sm text-gray-600 mt-0.5">{description}</p>}
          </div>
          <button onClick={onClose} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center" aria-label="Закрыть уведомление">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
        <div className={`h-full ${colorByType}`} style={{ width: `${progress}%`, transition: 'width 80ms linear' }} />
      </div>
    </div>
  );
};

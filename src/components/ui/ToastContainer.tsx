import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-28 right-4 z-[60] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((t) => {
        const bgClass =
          t.variant === 'success'
            ? 'bg-arcade-bg border-lime text-white'
            : t.variant === 'error'
            ? 'bg-arcade-bg border-red-400 text-white'
            : 'bg-brand-dark border-accent text-white';

        return (
          <div
            key={t.id}
            className={`pointer-events-auto p-3.5 rounded-[10px] border-2 shadow-neo flex items-start gap-3 transition-all ${bgClass}`}
          >
            {t.variant === 'success' && <CheckCircle2 className="w-5 h-5 text-lime shrink-0 mt-0.5" />}
            {t.variant === 'error' && <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
            {t.variant === 'info' && <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />}
            <div className="flex-1 min-w-0">
              <p className="font-pixel text-[9px] tracking-wider uppercase text-accent">{t.title}</p>
              <p className="text-sm text-gray-200 mt-1 leading-snug">{t.message}</p>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              aria-label="Fechar aviso"
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

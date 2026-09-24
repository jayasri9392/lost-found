import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

const Alert = ({ type = 'info', message, onDismiss }) => {
  if (!message) return null;

  const config = {
    error: {
      bg: 'bg-rose-50 border-rose-200 text-rose-800',
      icon: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />,
    },
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />,
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />,
    },
    info: {
      bg: 'bg-sky-50 border-sky-200 text-sky-800',
      icon: <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />,
    },
  };

  const style = config[type] || config.info;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border text-sm ${style.bg} transition-all duration-200`}
      role="alert"
    >
      {style.icon}
      <div className="flex-1 font-medium leading-relaxed">{message}</div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          type="button"
          className="text-slate-400 hover:text-slate-700 transition-colors p-1"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;

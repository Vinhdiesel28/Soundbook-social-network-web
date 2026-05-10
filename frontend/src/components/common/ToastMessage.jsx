import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

const styles = {
  success: {
    box: 'border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-300',
    icon: CheckCircle2,
  },
  error: {
    box: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300',
    icon: AlertCircle,
  },
  info: {
    box: 'border-primary-500/20 bg-primary-500/10 text-primary-600 dark:text-primary-300',
    icon: Info,
  },
};

const ToastMessage = ({ notice, onClose, autoClose = 3500 }) => {
  useEffect(() => {
    if (!notice || !autoClose) return undefined;
    const id = window.setTimeout(() => onClose?.(), autoClose);
    return () => window.clearTimeout(id);
  }, [notice, onClose, autoClose]);

  if (!notice) return null;
  const config = styles[notice.type] || styles.info;
  const Icon = config.icon;

  return (
    <div className={`fixed right-4 top-4 z-[120] flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-xl backdrop-blur ${config.box}`}>
      <Icon size={18} className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        {notice.title ? <p className="font-bold">{notice.title}</p> : null}
        <p className="leading-relaxed">{notice.message}</p>
      </div>
      <button type="button" onClick={onClose} className="rounded-full p-1 opacity-70 hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10">
        <X size={14} />
      </button>
    </div>
  );
};

export default ToastMessage;

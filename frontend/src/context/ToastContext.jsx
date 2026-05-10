import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setConfirmDialog({
        ...options,
        onConfirm: () => {
          setConfirmDialog(null);
          resolve(true);
        },
        onCancel: () => {
          setConfirmDialog(null);
          resolve(false);
        }
      });
    });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, confirm }}>
      {children}
      
      {/* TOAST CONTAINER */}
      <div className="fixed top-6 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border min-w-[300px] max-w-[450px] bg-white dark:bg-gray-900 ${
                toast.type === 'success' ? 'border-green-100 dark:border-green-900/30' :
                toast.type === 'error' ? 'border-red-100 dark:border-red-900/30' :
                toast.type === 'warning' ? 'border-yellow-100 dark:border-yellow-900/30' :
                'border-blue-100 dark:border-blue-900/30'
              }`}
            >
              <div className={`shrink-0 ${
                toast.type === 'success' ? 'text-green-500' :
                toast.type === 'error' ? 'text-red-500' :
                toast.type === 'warning' ? 'text-yellow-500' :
                'text-blue-500'
              }`}>
                {toast.type === 'success' && <CheckCircle size={20} />}
                {toast.type === 'error' && <XCircle size={20} />}
                {toast.type === 'warning' && <AlertCircle size={20} />}
                {toast.type === 'info' && <Info size={20} />}
              </div>
              <p className="flex-1 text-sm font-bold text-text-color">{toast.message}</p>
              <button 
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="text-text-muted hover:text-text-color transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* CONFIRM DIALOG */}
      <AnimatePresence>
        {confirmDialog && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-surface-color w-full max-w-md rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
            >
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-500 flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-black mb-2">{confirmDialog.title || 'Xác nhận'}</h3>
                <p className="text-text-muted leading-relaxed">{confirmDialog.message}</p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-900/50 flex gap-3 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={confirmDialog.onCancel}
                  className="flex-1 py-3 px-4 rounded-2xl font-bold text-sm text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {confirmDialog.cancelText || 'Hủy'}
                </button>
                <button
                  onClick={confirmDialog.onConfirm}
                  className="flex-1 py-3 px-4 rounded-2xl font-bold text-sm bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20 transition-all"
                >
                  {confirmDialog.confirmText || 'Đồng ý'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

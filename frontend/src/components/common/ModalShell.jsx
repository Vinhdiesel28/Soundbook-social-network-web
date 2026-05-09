import React from 'react';
import { X } from 'lucide-react';

const ModalShell = ({ open, title, description, children, footer, onClose, maxWidth = 'max-w-lg' }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label="Đóng"
        onClick={onClose}
      />
      <div className={`relative w-full ${maxWidth} overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900`}>
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <div>
            <h3 className="text-base font-bold text-text-color">{title}</h3>
            {description ? <p className="mt-1 text-xs leading-relaxed text-text-muted">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-text-muted hover:bg-gray-100 hover:text-text-color dark:hover:bg-gray-800"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer ? <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4 dark:border-gray-800">{footer}</div> : null}
      </div>
    </div>
  );
};

export default ModalShell;

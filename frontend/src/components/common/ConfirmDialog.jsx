import React from 'react';
import { AlertTriangle } from 'lucide-react';
import ModalShell from './ModalShell';

const ConfirmDialog = ({
  open,
  title = 'Xác nhận thao tác',
  message,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  danger = false,
  busy = false,
  onConfirm,
  onClose,
}) => (
  <ModalShell
    open={open}
    title={title}
    description={message}
    onClose={busy ? undefined : onClose}
    maxWidth="max-w-md"
    footer={(
      <>
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          className="rounded-xl px-4 py-2 text-sm font-semibold text-text-muted hover:bg-gray-100 disabled:opacity-60 dark:hover:bg-gray-800"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className={`rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-primary-500 hover:bg-primary-600'}`}
        >
          {busy ? 'Đang xử lý...' : confirmLabel}
        </button>
      </>
    )}
  >
    <div className={`flex items-start gap-3 rounded-2xl p-4 ${danger ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300' : 'bg-primary-500/10 text-primary-600 dark:text-primary-300'}`}>
      <AlertTriangle size={20} className="mt-0.5 shrink-0" />
      <p className="text-sm leading-relaxed">{message}</p>
    </div>
  </ModalShell>
);

export default ConfirmDialog;

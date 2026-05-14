import { useEffect } from 'react';
import { CloseIcon } from './icons';

function ConfirmModal({
  open,
  title = 'Xác nhận thao tác',
  message = 'Bạn có chắc chắn muốn tiếp tục?',
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  isConfirming = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isConfirming) {
        onCancel?.();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isConfirming, onCancel, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm" onClick={() => (!isConfirming ? onCancel?.() : null)}>
      <div className="panel w-full max-w-lg px-6 py-6 sm:px-7" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-red">Xác nhận</p>
            <h2 id="confirm-modal-title" className="mt-3 text-2xl font-semibold text-brand-ink">{title}</h2>
          </div>
          <button type="button" className="rounded-full border border-slate-200 p-2 text-slate-500 hover:border-slate-300 hover:text-brand-ink" onClick={() => onCancel?.()} disabled={isConfirming} aria-label="Đóng hộp thoại xác nhận">
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-4 text-sm leading-7 text-slate-600">{message}</p>

        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <button type="button" className="btn-secondary" onClick={() => onCancel?.()} disabled={isConfirming}>
            {cancelLabel}
          </button>
          <button type="button" className="btn-danger" onClick={() => onConfirm?.()} disabled={isConfirming}>
            {isConfirming ? 'Đang xử lý...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
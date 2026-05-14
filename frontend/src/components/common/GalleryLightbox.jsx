import { useEffect, useCallback } from 'react';

/**
 * Lightbox overlay for gallery items.
 * Props:
 *   items       — full array of gallery items
 *   openIndex   — currently open index (null = closed)
 *   onClose     — () => void
 *   onPrev      — () => void
 *   onNext      — () => void
 */
function GalleryLightbox({ items, openIndex, onClose, onPrev, onNext }) {
  const item = openIndex !== null ? items[openIndex] : null;

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    },
    [onClose, onPrev, onNext],
  );

  useEffect(() => {
    if (openIndex === null) return;
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [openIndex, handleKeyDown]);

  if (openIndex === null || !item) return null;

  const hasPrev = openIndex > 0;
  const hasNext = openIndex < items.length - 1;

  return (
    /* Backdrop — click outside image to close */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
    >
      {/* Content panel — stop propagation so clicks inside don't close */}
      <div
        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          aria-label="Đóng"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow hover:bg-white"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>

        {/* Image */}
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="max-h-[60vh] w-full object-contain bg-slate-100"
          />
        ) : (
          <div className="flex max-h-[60vh] min-h-[240px] w-full items-center justify-center bg-slate-100 text-slate-400 text-sm">
            Không có ảnh
          </div>
        )}

        {/* Caption */}
        <div className="flex items-center justify-between gap-4 px-6 py-5">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-brand-ink">{item.title}</h2>
            {item.album_name ? (
              <p className="mt-0.5 text-sm text-slate-500">{item.album_name}</p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {item.drive_url ? (
              <a
                href={item.drive_url}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm font-semibold text-brand"
                onClick={(e) => e.stopPropagation()}
              >
                Google Drive
              </a>
            ) : null}
          </div>
        </div>

        {/* Prev / Next navigation */}
        {(hasPrev || hasNext) ? (
          <div className="flex justify-between border-t border-slate-100 px-6 py-4">
            <button
              type="button"
              disabled={!hasPrev}
              onClick={onPrev}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 disabled:text-slate-300"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
              </svg>
              Trước
            </button>
            <span className="text-sm text-slate-400">{openIndex + 1} / {items.length}</span>
            <button
              type="button"
              disabled={!hasNext}
              onClick={onNext}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 disabled:text-slate-300"
            >
              Tiếp
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default GalleryLightbox;

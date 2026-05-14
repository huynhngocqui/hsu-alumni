function ToastItem({ item, onDismiss }) {
  const accentClass = item.type === 'error'
    ? 'border-red-200 bg-red-50 text-red-700'
    : item.type === 'warning'
      ? 'border-amber-200 bg-amber-50 text-amber-700'
      : 'border-emerald-200 bg-emerald-50 text-emerald-700';

  return (
    <div className={`w-full rounded-[24px] border px-4 py-4 shadow-[0_16px_40px_rgba(15,23,42,0.12)] ${accentClass}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          {item.title ? <p className="text-xs font-semibold uppercase tracking-[0.22em]">{item.title}</p> : null}
          <p className="mt-1 text-sm font-medium leading-6">{item.message}</p>
        </div>
        <button type="button" className="text-xs font-semibold" onClick={() => onDismiss(item.id)}>
          Đóng
        </button>
      </div>
    </div>
  );
}

function ToastStack({ items = [], onDismiss }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[70] flex w-full max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
      {items.map((item) => (
        <div key={item.id} className="pointer-events-auto">
          <ToastItem item={item} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}

export default ToastStack;
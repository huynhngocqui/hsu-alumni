function EmptyState({
  title = 'Chưa có dữ liệu',
  message = 'Nội dung sẽ xuất hiện khi có thông tin phù hợp.',
  action,
  actionLabel,
}) {
  return (
    <div className="panel flex min-h-48 flex-col items-center justify-center gap-4 px-6 py-10 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="max-w-md text-sm text-slate-500">{message}</p>
      {action && actionLabel ? (
        <button type="button" className="btn-secondary" onClick={action}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export default EmptyState;

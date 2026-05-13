function ErrorState({
  title = 'Không thể tải dữ liệu',
  message = 'Vui lòng thử lại hoặc quay lại sau.',
  action,
  actionLabel = 'Thử lại',
}) {
  return (
    <div className="panel flex min-h-48 flex-col items-center justify-center gap-4 px-6 py-10 text-center">
      <div className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
        Có lỗi xảy ra
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="max-w-md text-sm text-slate-500">{message}</p>
      {action ? (
        <button type="button" className="btn-primary" onClick={action}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export default ErrorState;

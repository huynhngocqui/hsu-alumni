function LoadingState({ title = 'Đang tải dữ liệu...', message = 'Vui lòng chờ trong giây lát.' }) {
  return (
    <div className="panel flex min-h-48 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand/20 border-t-brand" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="max-w-md text-sm text-slate-500">{message}</p>
    </div>
  );
}

export default LoadingState;

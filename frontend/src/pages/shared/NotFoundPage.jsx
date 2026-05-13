import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="page-shell">
      <section className="panel flex flex-col items-start gap-6 px-6 py-12 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">404</p>
        <h1 className="text-4xl font-semibold tracking-tight">Trang bạn tìm không tồn tại.</h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          Route hiện chưa được cấu hình hoặc đường dẫn không hợp lệ. Bạn có thể quay về trang chủ hoặc mở dashboard nếu đã đăng nhập.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/" className="btn-primary">
            Về trang chủ
          </Link>
          <Link to="/dashboard" className="btn-secondary">
            Mở dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}

export default NotFoundPage;

import { Link } from 'react-router-dom';

function ForbiddenPage() {
  return (
    <div className="page-shell">
      <section className="panel overflow-hidden">
        <div className="grid gap-8 px-6 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-12">
          <div className="rounded-[28px] bg-[linear-gradient(135deg,#0b4da2_0%,#09285b_100%)] px-6 py-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/70">403</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Bạn không có quyền truy cập khu vực quản trị này.</h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/80">
              Tài khoản của bạn đã đăng nhập thành công nhưng chưa được cấp vai trò quản trị viên. Nếu cần truy cập CMS, hãy liên hệ quản trị hệ thống để được phân quyền.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-4">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-5">
              <p className="text-sm leading-7 text-slate-600">Hệ thống áp dụng kiểm tra quyền chặt chẽ cho mọi route admin và admin API. Vì vậy bạn có thể duyệt các trang người dùng thông thường nhưng sẽ nhận 403 ở đây nếu không có quyền `ADMIN`.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/dashboard" className="btn-primary">
                Về dashboard
              </Link>
              <Link to="/" className="btn-secondary">
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ForbiddenPage;
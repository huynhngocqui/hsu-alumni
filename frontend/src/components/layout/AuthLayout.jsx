import { Link, Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-sand px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/50 bg-white shadow-panel lg:grid-cols-[1fr_1.15fr]">
        <section className="hidden bg-brand p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">Hoa Sen Alumni</p>
            <h1 className="mt-4 max-w-sm text-4xl font-semibold leading-tight text-white">
              Không chỉ đăng nhập, mà còn là cổng kết nối cộng đồng cựu sinh viên.
            </h1>
          </div>
          <p className="max-w-md text-sm leading-7 text-white/80">
            Giai đoạn đầu triển khai tập trung vào xác thực, hồ sơ cá nhân, Co-op, Job Matching và CMS nội dung Alumni.
          </p>
        </section>

        <section className="p-6 sm:p-10">
          <Link to="/" className="mb-8 inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-lg font-bold text-white">
              HSU
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">Alumni</div>
              <div className="text-sm font-semibold text-brand-ink">University Portal</div>
            </div>
          </Link>
          <Outlet />
        </section>
      </div>
    </div>
  );
}

export default AuthLayout;

import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { MenuIcon } from '../common/icons';

function AdminHeader({ title, description, onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 xl:px-10">
        <div className="flex items-start gap-3">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 lg:hidden"
            onClick={onMenuClick}
            aria-label="Mở menu quản trị"
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-red">Quản trị nội dung</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-brand-ink sm:text-[2rem]">{title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{description}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            <p className="font-semibold text-brand-ink">{user?.full_name || user?.email || 'Quản trị viên'}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em]">{user?.role || 'ADMIN'}</p>
          </div>
          <Link to="/dashboard" className="btn-secondary">
            Về dashboard người dùng
          </Link>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
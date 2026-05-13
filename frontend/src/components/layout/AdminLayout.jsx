import { NavLink, Outlet } from 'react-router-dom';

const adminLinks = [
  { to: '/admin', label: 'Tổng quan' },
  { to: '/admin/users', label: 'Tài khoản' },
  { to: '/admin/content/articles', label: 'Bài viết' },
  { to: '/admin/content/gallery', label: 'Thư viện ảnh' },
  { to: '/admin/tags', label: 'Tags' },
];

function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_1fr] lg:px-6">
        <aside className="panel h-fit p-4">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.3em] text-brand">Admin</p>
            <h2 className="mt-2 text-xl font-semibold">HSU Alumni CMS</h2>
          </div>

          <nav className="space-y-2">
            {adminLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/admin'}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-brand-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;

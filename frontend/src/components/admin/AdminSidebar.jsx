import { NavLink } from 'react-router-dom';
import { CloseIcon } from '../common/icons';

function SidebarLink({ item, onNavigate }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      end={item.to === '/admin'}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-[20px] px-4 py-3 text-sm font-medium transition ${
          isActive
            ? 'bg-brand text-white shadow-[0_16px_32px_rgba(2,77,161,0.24)]'
            : 'text-slate-600 hover:bg-slate-100 hover:text-brand-ink'
        }`
      }
    >
      {Icon ? <Icon className="h-5 w-5 shrink-0" /> : null}
      <span>{item.label}</span>
    </NavLink>
  );
}

function AdminSidebar({ sections, open, onClose }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm transition lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[290px] flex-col border-r border-slate-200 bg-white px-5 py-5 shadow-[0_24px_60px_rgba(15,23,42,0.16)] transition-transform lg:z-20 lg:translate-x-0 lg:shadow-none ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-red">HSU Alumni</p>
            <h2 className="mt-2 text-2xl font-semibold text-brand-ink">Admin Console</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Điều phối tin tức, sự kiện và cộng đồng trên một hệ quản trị full-screen.</p>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 lg:hidden"
            onClick={onClose}
            aria-label="Đóng menu quản trị"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-8 flex-1 space-y-7 overflow-y-auto pr-1">
          {sections.map((section) => (
            <div key={section.label}>
              <p className="px-4 text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">{section.label}</p>
              <div className="mt-3 space-y-2">
                {section.items.map((item) => (
                  <SidebarLink key={item.to} item={item} onNavigate={onClose} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
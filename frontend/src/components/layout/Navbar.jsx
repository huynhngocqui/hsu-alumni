import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import NotificationBell from '../notification/NotificationBell';
import { useAuth } from '../../hooks/useAuth';
import { logoutUser } from '../../api/auth';
import { mainNavigation, utilityNavigation } from '../../config/navigation';
import { siteMeta } from '../../config/site';
import { ChevronDownIcon, CloseIcon, ExternalLinkIcon, MenuIcon, PhoneIcon } from '../common/icons';

function matchesPath(pathname, matcher) {
  if (!matcher) {
    return false;
  }

  if (matcher === '/') {
    return pathname === '/';
  }

  return pathname.startsWith(matcher);
}

function isItemActive(item, pathname) {
  const ownMatch = (item.activeMatch || []).some((matcher) => matchesPath(pathname, matcher));
  const childMatch = (item.children || []).some((child) => (child.activeMatch || []).some((matcher) => matchesPath(pathname, matcher)));

  return ownMatch || childMatch;
}

function InlineNavLink({ item, className, children, onNavigate }) {
  if (item.external) {
    return (
      <a
        href={item.path}
        target={item.target || '_blank'}
        rel={item.rel || 'noreferrer noopener'}
        className={className}
        onClick={onNavigate}
      >
        {children}
      </a>
    );
  }

  return (
    <NavLink to={item.path} className={className} onClick={onNavigate}>
      {children}
    </NavLink>
  );
}

function Navbar() {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [openDesktopMenu, setOpenDesktopMenu] = useState('');
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [openMobileGroup, setOpenMobileGroup] = useState('');
  const shellRef = useRef(null);

  useEffect(() => {
    setOpenDesktopMenu('');
    setOpenMobileMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (shellRef.current && !shellRef.current.contains(event.target)) {
        setOpenDesktopMenu('');
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenDesktopMenu('');
        setOpenMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!openMobileMenu) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [openMobileMenu]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Ignore network logout failures and clear local session state.
    }

    logout();
  };

  const renderDesktopAction = () => {
    if (isAuthenticated) {
      return (
        <div className="hidden items-center gap-3 xl:flex">
          <NotificationBell />
          <NavLink
            to="/dashboard"
            className="inline-flex items-center rounded-full border border-brand/15 px-4 py-2 text-sm font-semibold text-brand-ink hover:bg-brand-sand"
          >
            {user?.full_name || 'Dashboard'}
          </NavLink>
          <button type="button" className="btn-primary" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      );
    }

    return (
      <div className="hidden items-center gap-3 xl:flex">
        <NavLink to="/dang-nhap" className="btn-secondary">
          Đăng nhập
        </NavLink>
        <NavLink to="/dang-ky" className="btn-primary">
          Đăng ký
        </NavLink>
      </div>
    );
  };

  const renderMobileAction = () => {
    if (isAuthenticated) {
      return (
        <div className="space-y-3 border-t border-slate-200 pt-5">
          <NavLink to="/dashboard" className="btn-secondary w-full justify-center">
            {user?.full_name || 'Dashboard'}
          </NavLink>
          <button type="button" className="btn-primary w-full justify-center" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-3 border-t border-slate-200 pt-5">
        <NavLink to="/dang-nhap" className="btn-secondary w-full justify-center">
          Đăng nhập
        </NavLink>
        <NavLink to="/dang-ky" className="btn-primary w-full justify-center">
          Đăng ký thành viên
        </NavLink>
      </div>
    );
  };

  return (
    <header ref={shellRef} className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur">
      <div className="hidden border-b border-slate-200 bg-slate-50 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-[13px] text-slate-600 lg:px-8">
          <a href={siteMeta.primaryHotlineHref} className="inline-flex items-center gap-2 font-medium text-brand-ink hover:text-brand">
            <PhoneIcon className="h-4 w-4 text-brand" />
            Hotline {siteMeta.primaryHotlineLabel}
          </a>

          <div className="flex items-center gap-5">
            {utilityNavigation.map((item) => (
              <InlineNavLink key={item.id} item={item} className="inline-flex items-center gap-2 transition hover:text-brand-ink">
                <span>{item.label}</span>
                <ExternalLinkIcon className="h-3.5 w-3.5" />
              </InlineNavLink>
            ))}
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-brand">VI</span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3" aria-label="Trang chủ HSU Alumni">
          <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-brand text-lg font-black tracking-[0.08em] text-white shadow-panel">
            HSU
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.36em] text-brand-red">HSU Alumni</p>
            <div className="flex items-center gap-3">
              <p className="text-base font-extrabold uppercase tracking-[0.04em] text-brand-ink sm:text-lg">Đại học Hoa Sen</p>
              <span className="hidden h-7 w-px bg-slate-200 sm:block" />
              <p className="hidden text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 sm:block">
                {siteMeta.brandStatement}
              </p>
            </div>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-2 xl:flex" aria-label="Main navigation">
          {mainNavigation.map((item) => {
            const active = isItemActive(item, location.pathname);

            if (!item.children?.length) {
              return (
                <InlineNavLink
                  key={item.id}
                  item={item}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active ? 'bg-brand text-white shadow-panel' : 'text-slate-700 hover:bg-brand-sand hover:text-brand-ink'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.external ? <ExternalLinkIcon className="h-3.5 w-3.5" /> : null}
                </InlineNavLink>
              );
            }

            const isOpen = openDesktopMenu === item.id;

            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => setOpenDesktopMenu(item.id)}
                onMouseLeave={() => setOpenDesktopMenu((current) => (current === item.id ? '' : current))}
              >
                <button
                  type="button"
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active ? 'bg-brand text-white shadow-panel' : 'text-slate-700 hover:bg-brand-sand hover:text-brand-ink'
                  }`}
                  aria-expanded={isOpen}
                  aria-controls={`desktop-menu-${item.id}`}
                  onClick={() => setOpenDesktopMenu((current) => (current === item.id ? '' : item.id))}
                  onFocus={() => setOpenDesktopMenu(item.id)}
                >
                  {item.label}
                  <ChevronDownIcon className={`h-4 w-4 transition ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <div
                  id={`desktop-menu-${item.id}`}
                  className={`absolute left-0 top-full z-30 pt-4 transition ${
                    isOpen ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-2 opacity-0'
                  }`}
                >
                  <div className="w-[360px] rounded-[28px] border border-slate-200 bg-white p-3 shadow-2xl">
                    {item.children.map((child) => (
                      <InlineNavLink
                        key={child.id}
                        item={child}
                        className={`group flex rounded-[22px] px-4 py-3 transition ${
                          isItemActive(child, location.pathname) ? 'bg-brand-sand text-brand-ink' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="inline-flex items-center gap-2 text-sm font-semibold text-brand-ink">
                            <span>{child.label}</span>
                            {child.external ? <ExternalLinkIcon className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand" /> : null}
                          </div>
                          {child.description ? (
                            <p className="mt-1 text-xs leading-5 text-slate-500">{child.description}</p>
                          ) : null}
                        </div>
                      </InlineNavLink>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {renderDesktopAction()}

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-brand-ink xl:hidden"
            onClick={() => setOpenMobileMenu(true)}
            aria-label="Mở menu"
            aria-expanded={openMobileMenu}
            aria-controls="mobile-site-menu"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {openMobileMenu ? (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div
            className="absolute inset-0 bg-brand-ink/55"
            onClick={() => setOpenMobileMenu(false)}
            aria-hidden="true"
          />

          <div id="mobile-site-menu" className="absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-white px-5 py-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.36em] text-brand-red">HSU Alumni</p>
                <h2 className="mt-1 text-lg font-extrabold uppercase tracking-[0.04em] text-brand-ink">Đại học Hoa Sen</h2>
              </div>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-brand-ink"
                onClick={() => setOpenMobileMenu(false)}
                aria-label="Đóng menu"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 rounded-[22px] bg-brand-sand px-4 py-3 text-sm text-slate-600">
              <a href={siteMeta.primaryHotlineHref} className="inline-flex items-center gap-2 font-semibold text-brand-ink">
                <PhoneIcon className="h-4 w-4 text-brand" />
                {siteMeta.primaryHotlineLabel}
              </a>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand">VI</span>
            </div>

            <nav className="mt-6 space-y-3" aria-label="Mobile navigation">
              {mainNavigation.map((item) => {
                const active = isItemActive(item, location.pathname);

                if (!item.children?.length) {
                  return (
                    <InlineNavLink
                      key={item.id}
                      item={item}
                      className={`flex items-center justify-between rounded-[22px] px-4 py-3 text-sm font-semibold transition ${
                        active ? 'bg-brand text-white' : 'bg-slate-50 text-brand-ink hover:bg-brand-sand'
                      }`}
                      onNavigate={() => setOpenMobileMenu(false)}
                    >
                      <span>{item.label}</span>
                      {item.external ? <ExternalLinkIcon className="h-4 w-4" /> : null}
                    </InlineNavLink>
                  );
                }

                const isOpen = openMobileGroup === item.id;

                return (
                  <div key={item.id} className="rounded-[22px] bg-slate-50 px-4 py-3">
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between text-left text-sm font-semibold ${
                        active ? 'text-brand' : 'text-brand-ink'
                      }`}
                      aria-expanded={isOpen}
                      aria-controls={`mobile-group-${item.id}`}
                      onClick={() => setOpenMobileGroup((current) => (current === item.id ? '' : item.id))}
                    >
                      <span>{item.label}</span>
                      <ChevronDownIcon className={`h-4 w-4 transition ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <div id={`mobile-group-${item.id}`} className={`${isOpen ? 'mt-3 block' : 'hidden'} space-y-2`}>
                      {item.children.map((child) => (
                        <InlineNavLink
                          key={child.id}
                          item={child}
                          className={`flex items-start justify-between gap-3 rounded-2xl px-3 py-3 text-sm transition ${
                            isItemActive(child, location.pathname) ? 'bg-white text-brand-ink' : 'bg-white/70 text-slate-600 hover:bg-white'
                          }`}
                          onNavigate={() => setOpenMobileMenu(false)}
                        >
                          <span className="flex-1">
                            <span className="block font-medium">{child.label}</span>
                            {child.description ? <span className="mt-1 block text-xs leading-5 text-slate-500">{child.description}</span> : null}
                          </span>
                          {child.external ? <ExternalLinkIcon className="mt-0.5 h-4 w-4 flex-none" /> : null}
                        </InlineNavLink>
                      ))}
                    </div>
                  </div>
                );
              })}
            </nav>

            <div className="mt-6 space-y-3 border-t border-slate-200 pt-5">
              {utilityNavigation.map((item) => (
                <InlineNavLink
                  key={item.id}
                  item={item}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-brand-ink"
                  onNavigate={() => setOpenMobileMenu(false)}
                >
                  <span>{item.label}</span>
                  <ExternalLinkIcon className="h-4 w-4" />
                </InlineNavLink>
              ))}
            </div>

            <div className="mt-6">{renderMobileAction()}</div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Navbar;

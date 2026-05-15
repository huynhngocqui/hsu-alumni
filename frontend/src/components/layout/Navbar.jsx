import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';
import BrandImage from '../common/BrandImage';
import NotificationBell from '../notification/NotificationBell';
import { useAuth } from '../../hooks/useAuth';
import { logoutUser } from '../../api/auth';
import { mainNavigation, utilityNavigation } from '../../config/navigation';
import { siteMeta } from '../../config/site';
import { ChevronDownIcon, CloseIcon, ExternalLinkIcon, MenuIcon, PhoneIcon, SearchIcon } from '../common/icons';

const navbarFontStyle = {
  fontFamily: "'Inter', 'Roboto', sans-serif",
};

const SCROLL_ENTER_THRESHOLD = 104;
const SCROLL_EXIT_THRESHOLD = 14;

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
  const { isAuthenticated, isAuthReady, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
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

  useEffect(() => {
    let frameId = 0;

    const syncScrollState = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled((current) => {
        if (current) {
          return currentScrollY > SCROLL_EXIT_THRESHOLD;
        }

        return currentScrollY >= SCROLL_ENTER_THRESHOLD;
      });

      frameId = 0;
    };

    const handleScroll = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(syncScrollState);
    };

    syncScrollState();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const defaultLogo = siteMeta.brandAssets?.navbar?.defaultLogo;
  const compactLogo = siteMeta.brandAssets?.navbar?.compactLogo || defaultLogo;
  const mobileLogo = siteMeta.brandAssets?.navbar?.mobileLogo || defaultLogo;

  const desktopNavItemClass = (active) =>
    [
      'inline-flex h-9 items-center gap-1.5 px-2 text-[0.84rem] font-medium tracking-[0.01em] transition-all duration-300',
      isScrolled
        ? active
          ? 'text-white'
          : 'text-white hover:bg-white/12 hover:text-white'
        : active
          ? 'text-[#0054A6]'
          : 'text-slate-700 hover:text-[#0054A6]',
    ].join(' ');

  const topBarSecondaryActionClass =
    'inline-flex h-7 items-center justify-center rounded-full border border-white/14 bg-white/10 px-4 text-[13px] font-medium text-white transition duration-300 hover:border-white/24 hover:bg-white/16';

  const topBarPrimaryActionClass =
    'inline-flex h-7 items-center justify-center rounded-full bg-white px-4 text-[13px] font-medium text-[#0054A6] transition duration-300 hover:bg-[#F4F8FF]';

  const desktopSecondaryActionClass = [
    'inline-flex h-9 items-center justify-center rounded-full border px-5 text-sm font-medium transition-all duration-300',
    isScrolled
      ? 'border-white/20 bg-white/10 text-white hover:border-white/35 hover:bg-white/16'
      : 'border-[#0054A6]/15 bg-white text-brand-ink hover:border-[#0054A6]/30 hover:bg-[#EFF5FB]',
  ].join(' ');

  const desktopPrimaryActionClass = [
    'inline-flex h-9 items-center justify-center rounded-full px-5 text-sm font-medium transition-all duration-300',
    isScrolled
      ? 'bg-white text-[#0054A6] hover:bg-white/90'
      : 'bg-[#0054A6] text-white shadow-[0_14px_30px_rgba(0,84,166,0.18)] hover:bg-[#00458A]',
  ].join(' ');

  const mobileSecondaryActionClass =
    'inline-flex items-center justify-center rounded-full border border-[#0054A6]/12 bg-white px-5 py-3 text-sm font-medium text-brand-ink transition duration-300 hover:border-[#0054A6]/20 hover:bg-[#EFF5FB]';

  const mobilePrimaryActionClass =
    'inline-flex items-center justify-center rounded-full bg-[#0054A6] px-5 py-3 text-sm font-medium text-white transition duration-300 hover:bg-[#00458A]';

  const topBarNotificationClass =
    '[&_button]:h-9 [&_button]:w-9 [&_button]:border-white/14 [&_button]:bg-white/10 [&_button]:text-white [&_button]:hover:border-white/24 [&_button]:hover:bg-white/16 [&_button>span]:bg-[#D6B24A] [&_button>span]:text-[#102345]';

  const compactNotificationClass =
    '[&_button]:border-white/20 [&_button]:bg-white/10 [&_button]:text-white [&_button]:hover:border-white/35 [&_button]:hover:bg-white/16 [&_button>span]:bg-[#D6B24A] [&_button>span]:text-[#102345]';

  const roleNavigation = isAuthenticated
    ? [
        {
          id: 'nav-role-workspace',
          label: 'Khu vực của tôi',
          path: '/dashboard',
          external: false,
          target: '_self',
          rel: '',
          activeMatch: ['/dashboard', '/ho-so', '/admin'],
          children: [
            {
              id: 'nav-role-dashboard',
              label: 'Dashboard',
              path: '/dashboard',
              external: false,
              target: '_self',
              rel: '',
              children: [],
              activeMatch: ['/dashboard'],
            },
            {
              id: 'nav-role-owner-posts',
              label: 'Quản lý bài đăng',
              path: '/dashboard/bai-dang',
              external: false,
              target: '_self',
              rel: '',
              children: [],
              activeMatch: ['/dashboard/bai-dang'],
            },
            {
              id: 'nav-role-applications',
              label: 'Hồ sơ đã ứng tuyển',
              path: '/dashboard/ung-tuyen',
              external: false,
              target: '_self',
              rel: '',
              children: [],
              activeMatch: ['/dashboard/ung-tuyen'],
            },
            {
              id: 'nav-role-profile',
              label: 'Hồ sơ cá nhân',
              path: '/ho-so',
              external: false,
              target: '_self',
              rel: '',
              children: [],
              activeMatch: ['/ho-so'],
            },
            ...(user?.role === 'ADMIN'
              ? [
                  {
                    id: 'nav-role-admin',
                    label: 'Admin CMS',
                    path: '/admin',
                    external: false,
                    target: '_self',
                    rel: '',
                    children: [],
                    activeMatch: ['/admin'],
                  },
                ]
              : []),
          ],
        },
      ]
    : [];

  const navigationItems = [...mainNavigation, ...roleNavigation];

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Ignore network logout failures and clear local session state.
    }

    logout();
  };

  const renderTopBarAction = () => {
    if (!isAuthReady) {
      return null;
    }

    if (isAuthenticated) {
      return (
        <div className="hidden items-center gap-2 lg:flex">
          <div className={topBarNotificationClass}>
            <NotificationBell />
          </div>
          <NavLink to="/dashboard" className={`${topBarSecondaryActionClass} max-w-[176px]`}>
            <span className="truncate">{user?.full_name || 'Dashboard'}</span>
          </NavLink>
          <button type="button" className={topBarPrimaryActionClass} onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      );
    }

    return (
      <div className="hidden items-center gap-2 lg:flex">
        <NavLink to="/dang-nhap" className={topBarSecondaryActionClass}>
          Đăng nhập
        </NavLink>
        <NavLink to="/dang-ky" className={topBarPrimaryActionClass}>
          Đăng ký
        </NavLink>
      </div>
    );
  };

  const renderCompactDesktopAction = () => {
    if (!isAuthReady) {
      return null;
    }

    if (!isScrolled) {
      return null;
    }

    if (isAuthenticated) {
      return (
        <div className="hidden items-center gap-3 xl:flex">
          <div className={compactNotificationClass}>
            <NotificationBell />
          </div>
          <NavLink to="/dashboard" className={`${desktopSecondaryActionClass} max-w-[220px]`}>
            <span className="truncate">{user?.full_name || 'Dashboard'}</span>
          </NavLink>
          <button type="button" className={desktopPrimaryActionClass} onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      );
    }

    return (
      <div className="hidden items-center gap-3 xl:flex">
        <NavLink to="/dang-nhap" className={desktopSecondaryActionClass}>
          Đăng nhập
        </NavLink>
        <NavLink to="/dang-ky" className={desktopPrimaryActionClass}>
          Đăng ký
        </NavLink>
      </div>
    );
  };

  const renderMobileAction = () => {
    if (!isAuthReady) {
      return null;
    }

    if (isAuthenticated) {
      return (
        <div className="space-y-3 border-t border-slate-200 pt-5">
          <NavLink to="/dashboard" className={`${mobileSecondaryActionClass} w-full`}>
            {user?.full_name || 'Dashboard'}
          </NavLink>
          <button type="button" className={`${mobilePrimaryActionClass} w-full`} onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-3 border-t border-slate-200 pt-5">
        <NavLink to="/dang-nhap" className={`${mobileSecondaryActionClass} w-full`}>
          Đăng nhập
        </NavLink>
        <NavLink to="/dang-ky" className={`${mobilePrimaryActionClass} w-full`}>
          Đăng ký thành viên
        </NavLink>
      </div>
    );
  };

  const brandFallback = (
    <div className="min-w-0">
      <p
        className={`text-[10px] font-semibold uppercase tracking-[0.34em] transition-colors duration-300 ${
          isScrolled ? 'text-[#D6B24A]' : 'text-[#0054A6]'
        }`}
      >
        HSU Alumni
      </p>
      <div className="mt-1 flex min-w-0 items-center gap-3">
        <p
          className={`truncate text-base font-medium transition-all duration-300 ${
            isScrolled ? 'text-white sm:text-[1.02rem]' : 'text-[#102345] sm:text-[1.22rem]'
          }`}
        >
          {siteMeta.universityName}
        </p>
        <span
          className={`hidden w-px transition-all duration-300 sm:block ${
            isScrolled ? 'h-0 opacity-0' : 'h-7 bg-slate-200 opacity-100'
          }`}
        />
        <p
          className={`hidden overflow-hidden whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.24em] transition-all duration-300 xl:block ${
            isScrolled ? 'max-w-0 translate-x-[-0.25rem] opacity-0' : 'max-w-[14rem] opacity-100 text-slate-500'
          }`}
        >
          {siteMeta.brandStatement}
        </p>
      </div>
    </div>
  );

  const mobileMenu =
    openMobileMenu && typeof document !== 'undefined'
      ? createPortal(
          <div className="fixed inset-0 z-[80] xl:hidden">
            <div
              className="absolute inset-0 bg-[#0B1D3A]/55 backdrop-blur-[2px]"
              onClick={() => setOpenMobileMenu(false)}
              aria-hidden="true"
            />

            <div
              id="mobile-site-menu"
              className="absolute inset-y-0 right-0 w-full max-w-[420px] overflow-y-auto bg-[#F8FBFF] shadow-[0_28px_60px_rgba(8,43,84,0.24)]"
            >
              <div className="bg-[#0054A6] px-5 py-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 pr-2">
                    <BrandImage
                      src={mobileLogo}
                      alt={`${siteMeta.siteName} mobile logo`}
                      className="h-auto max-h-[54px] w-auto max-w-full object-contain"
                      fallback={
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-black tracking-[0.16em] text-[#0054A6]">
                            HSU
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#FFF2C2]">HSU Alumni</p>
                            <h2 className="mt-1 text-lg font-extrabold uppercase tracking-[0.04em] text-white">Đại học Hoa Sen</h2>
                          </div>
                        </div>
                      }
                    />
                  </div>
                  <button
                    type="button"
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white"
                    onClick={() => setOpenMobileMenu(false)}
                    aria-label="Đóng menu"
                  >
                    <CloseIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3 rounded-[24px] border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/90">
                  <a href={siteMeta.primaryHotlineHref} className="inline-flex items-center gap-2 font-semibold text-white">
                    <PhoneIcon className="h-4 w-4" />
                    {siteMeta.primaryHotlineLabel}
                  </a>
                  <span className="rounded-full border border-[#D6B24A]/40 bg-[#D6B24A]/16 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#FFF2C2]">
                    VI
                  </span>
                </div>
              </div>

              <div className="px-5 py-6">
                <nav className="space-y-3" aria-label="Mobile navigation">
                  {navigationItems.map((item) => {
                    const active = isItemActive(item, location.pathname);

                    if (!item.children?.length) {
                      return (
                        <InlineNavLink
                          key={item.id}
                          item={item}
                          className={`flex items-center justify-between rounded-[24px] border px-4 py-3 text-sm font-semibold transition duration-300 ${
                            active
                              ? 'border-[#0054A6] bg-[#0054A6] text-white shadow-[0_14px_28px_rgba(0,84,166,0.18)]'
                              : 'border-[#0054A6]/10 bg-white text-brand-ink hover:border-[#0054A6]/20 hover:bg-[#EFF5FB]'
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
                      <div key={item.id} className="rounded-[24px] border border-[#0054A6]/10 bg-white px-4 py-4 shadow-sm">
                        <button
                          type="button"
                          className={`flex w-full items-center justify-between text-left text-sm font-semibold ${
                            active ? 'text-[#0054A6]' : 'text-brand-ink'
                          }`}
                          aria-expanded={isOpen}
                          aria-controls={`mobile-group-${item.id}`}
                          onClick={() => setOpenMobileGroup((current) => (current === item.id ? '' : item.id))}
                        >
                          <span>{item.label}</span>
                          <ChevronDownIcon className={`h-4 w-4 transition duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <div id={`mobile-group-${item.id}`} className={`${isOpen ? 'mt-3 block' : 'hidden'} space-y-2`}>
                          {item.children.map((child) => (
                            <InlineNavLink
                              key={child.id}
                              item={child}
                              className={`flex items-start justify-between gap-3 rounded-[18px] px-3 py-3 text-sm transition duration-300 ${
                                isItemActive(child, location.pathname)
                                  ? 'bg-[#EFF5FB] text-[#0054A6]'
                                  : 'bg-slate-50 text-slate-600 hover:bg-white'
                              }`}
                              onNavigate={() => setOpenMobileMenu(false)}
                            >
                              <span className="flex-1">
                                <span className="block font-medium">{child.label}</span>
                                {child.description ? (
                                  <span className="mt-1 block text-xs leading-5 text-slate-500">{child.description}</span>
                                ) : null}
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
                      className="flex items-center justify-between rounded-[22px] border border-[#0054A6]/10 bg-white px-4 py-3 text-sm font-medium text-brand-ink transition duration-300 hover:border-[#0054A6]/20 hover:bg-[#EFF5FB]"
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
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <header
        ref={shellRef}
        style={navbarFontStyle}
        className={`sticky top-0 z-20 w-full transition-all duration-300 ${
          isScrolled
            ? 'border-b border-[#003B77]/30 bg-[#0054A6] shadow-[0_16px_36px_rgba(0,46,96,0.24)]'
            : 'border-b border-slate-200/90 bg-white/95 shadow-[0_8px_24px_rgba(15,23,42,0.06)] backdrop-blur'
        }`}
      >
        <div
          className={`hidden overflow-hidden transition-all duration-300 lg:block ${
            isScrolled ? 'pointer-events-none max-h-0 border-transparent opacity-0' : 'max-h-[40px] border-b border-white/10 opacity-100'
          }`}
        >
          <div className="bg-[#024da1]">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 lg:px-8">
              <div className="min-w-0">
                <p className="truncate text-[14px] font-medium text-white">
                  {siteMeta.universityName}
                </p>
                <p className="hidden truncate text-[11px] text-white/72 xl:block">{siteMeta.brandStatement}</p>
              </div>

              <div className="flex items-center gap-2 lg:gap-3">
                {utilityNavigation.map((item) => (
                  <InlineNavLink
                    key={item.id}
                    item={item}
                    className="inline-flex items-center gap-2 px-3 py-2 text-[14px] font-medium text-white transition duration-300 hover:bg-white/10"
                  >
                    <span>{item.label}</span>
                  </InlineNavLink>
                ))}

                <span className="inline-flex h-6 items-center rounded-full border border-[#D6B24A]/45 bg-[#D6B24A]/16 px-3 text-[11px] font-bold uppercase tracking-[0.24em] text-[#FFF2C2]">
                  VI
                </span>
                <span className="hidden h-5 w-px bg-white/12 lg:block" />
                {renderTopBarAction()}
              </div>
            </div>
          </div>
        </div>

        <div className={`transition-colors duration-300 ${isScrolled ? 'bg-[#024da1]' : 'bg-white'}`}>
          <div
            className={`mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8 ${
              isScrolled ? 'max-h-[60px] py-2.5' : 'max-h-[90px] py-2'
            } transition-all duration-300`}
          >
            <NavLink to="/" className="flex min-w-0 items-center" aria-label="Trang chủ HSU Alumni">
              <BrandImage
                src={isScrolled ? compactLogo : defaultLogo}
                alt={`${siteMeta.siteName} logo`}
                className={`block h-auto w-auto max-w-full object-contain transition-all duration-300 ${
                  isScrolled ? 'max-h-[42px] sm:max-h-[46px]' : 'max-h-[66px] sm:max-h-[80px]'
                }`}
                fallback={brandFallback}
              />
            </NavLink>

            <nav className="hidden flex-1 items-center justify-end gap-2 xl:flex" aria-label="Main navigation">
              {navigationItems.map((item) => {
                const active = isItemActive(item, location.pathname);

                if (!item.children?.length) {
                  return (
                    <InlineNavLink key={item.id} item={item} className={desktopNavItemClass(active)}>
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
                      className={desktopNavItemClass(active)}
                      aria-expanded={isOpen}
                      aria-controls={`desktop-menu-${item.id}`}
                      onClick={() => setOpenDesktopMenu((current) => (current === item.id ? '' : item.id))}
                      onFocus={() => setOpenDesktopMenu(item.id)}
                    >
                      {item.label}
                      <ChevronDownIcon className={`h-4 w-4 transition duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <div
                      id={`desktop-menu-${item.id}`}
                      className={`absolute left-0 top-full z-30 pt-4 transition-all duration-300 ${
                        isOpen ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-2 opacity-0'
                      }`}
                    >
                      <div className="w-[200px] rounded-[15px] border border-slate-200/85 bg-white p-3 shadow-[0_26px_58px_rgba(8,43,84,0.18)]">
                        {item.children.map((child) => (
                          <InlineNavLink
                            key={child.id}
                            item={child}
                            className={`group flex rounded-[15px] px-2 py-2 transition duration-300 ${
                              isItemActive(child, location.pathname) ? 'bg-[#F1F7FF] text-[#0054A6]' : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex-1">
                              <div className="inline-flex items-center gap-2 text-sm font-medium text-brand-ink">
                                <span>{child.label}</span>
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

            {renderCompactDesktopAction()}

            <button
              type="button"
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 xl:hidden ${
                isScrolled
                  ? 'border-white/20 bg-white/10 text-white hover:bg-white/16'
                  : 'border-[#0054A6]/12 bg-white text-[#0054A6] shadow-[0_14px_30px_rgba(0,84,166,0.12)] hover:border-[#0054A6]/30 hover:bg-[#EFF5FB]'
              }`}
              onClick={() => setOpenMobileMenu(true)}
              aria-label="Mở menu"
              aria-expanded={openMobileMenu}
              aria-controls="mobile-site-menu"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      {mobileMenu}
    </>
  );
}

export default Navbar;

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminSummary } from '../../api/admin';
import DashboardStats from '../../components/admin/DashboardStats';

function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let active = true;
    getAdminSummary()
      .then((data) => { if (active) setSummary(data); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const stats = useMemo(() => ([
    {
      label: 'Tài khoản chờ duyệt',
      value: summary ? String(summary.pending_users) : '…',
      description: 'Những tài khoản mới đang chờ admin xác thực.',
    },
    {
      label: 'Tin tức đang live',
      value: summary ? String(summary.published_news) : '…',
      meta: 'NEWS',
      description: 'Số lượng bài viết tin tức đã xuất bản lên route công khai.',
    },
    {
      label: 'Sự kiện upcoming',
      value: summary ? String(summary.upcoming_events) : '…',
      meta: 'EVENTS',
      description: 'Các sự kiện sắp diễn ra đang hiển thị trên route `/su-kien`.',
    },
    {
      label: 'Alumni profiles',
      value: summary ? String(summary.total_alumni_posts) : '…',
      meta: 'ALUMNI',
      description: 'Tổng số hồ sơ cộng đồng alumni đang quản trị trong CMS.',
    },
  ]), [summary]);

  const quickLinks = [
    { label: 'Quản lý tin tức', to: '/admin/tin-tuc', description: 'CRUD bài viết, thumbnail, SEO và related news.' },
    { label: 'Quản lý sự kiện', to: '/admin/su-kien', description: 'Banner, lịch diễn ra, đăng ký và gallery sự kiện.' },
    { label: 'Quản lý danh mục', to: '/admin/tin-tuc/danh-muc', description: 'Tạo và sắp xếp nhóm danh mục cho route tin tức.' },
    { label: 'Cộng đồng Alumni', to: '/admin/cong-dong-alumni', description: 'Hồ sơ alumni, nội dung song ngữ và ảnh đại diện.' },
    { label: 'Người dùng', to: '/admin/users', description: 'Kiểm duyệt tài khoản và theo dõi quyền truy cập.' },
  ];

  return (
    <div className="space-y-8">
      <DashboardStats items={stats} />

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[30px] border border-slate-200 bg-white px-6 py-6 shadow-[0_18px_36px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-red">Điều phối nhanh</p>
          <h2 className="mt-3 text-2xl font-semibold text-brand-ink">Các module mới của hệ thống nội dung</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {quickLinks.map((link) => (
              <Link key={link.to} to={link.to} className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-5 transition hover:-translate-y-0.5 hover:border-brand/20 hover:bg-white">
                <h3 className="text-lg font-semibold text-brand-ink">{link.label}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-slate-200 bg-[linear-gradient(160deg,#08214a_0%,#0b4da2_100%)] px-6 py-6 text-white shadow-[0_18px_36px_rgba(15,23,42,0.12)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/72">Live status</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Tổng quan nhanh cho ca vận hành hiện tại</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] bg-white/10 px-4 py-4 backdrop-blur-sm">
              <p className="text-sm text-white/70">Draft news</p>
              <p className="mt-2 text-3xl font-semibold">{summary ? summary.draft_news : '…'}</p>
            </div>
            <div className="rounded-[24px] bg-white/10 px-4 py-4 backdrop-blur-sm">
              <p className="text-sm text-white/70">Past events</p>
              <p className="mt-2 text-3xl font-semibold">{summary ? summary.past_events : '…'}</p>
            </div>
            <div className="rounded-[24px] bg-white/10 px-4 py-4 backdrop-blur-sm">
              <p className="text-sm text-white/70">Pending gallery</p>
              <p className="mt-2 text-3xl font-semibold">{summary ? summary.pending_gallery : '…'}</p>
            </div>
            <div className="rounded-[24px] bg-white/10 px-4 py-4 backdrop-blur-sm">
              <p className="text-sm text-white/70">Draft stories</p>
              <p className="mt-2 text-3xl font-semibold">{summary ? summary.draft_stories : '…'}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboardPage;

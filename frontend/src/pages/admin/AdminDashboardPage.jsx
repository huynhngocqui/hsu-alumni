function AdminDashboardPage() {
  const stats = [
    { label: 'Tài khoản chờ xác thực', value: '0' },
    { label: 'Bài viết CMS đang hoạt động', value: '0' },
    { label: 'Đóng góp ảnh chờ duyệt', value: '0' },
  ];

  return (
    <div className="space-y-6">
      <section className="panel px-6 py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Admin Overview</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Bảng điều khiển quản trị</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          Khung quản trị ban đầu đã sẵn sàng để nối users moderation, CMS article management, gallery moderation và taxonomy tags.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <article key={stat.label} className="panel px-6 py-6">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-4 text-3xl font-semibold text-brand-ink">{stat.value}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export default AdminDashboardPage;

import { useEffect, useState } from 'react';
import PageLayout from '../../components/common/PageLayout';
import EmptyState from '../../components/common/EmptyState';
import { listAdminUsers, updateAdminUser } from '../../api/admin';

function AdminUsersPage() {
  const [filters, setFilters] = useState({ search: '', accountStatus: 'ALL' });
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState({ type: '', message: '' });

  const refreshUsers = async (nextFilters = filters) => {
    const params = new URLSearchParams();
    if (nextFilters.search.trim()) {
      params.set('search', nextFilters.search.trim());
    }
    if (nextFilters.accountStatus !== 'ALL') {
      params.set('account_status', nextFilters.accountStatus);
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    const nextItems = await listAdminUsers(query);
    setItems(nextItems);
  };

  useEffect(() => {
    refreshUsers().catch(() => setItems([]));
  }, []);

  const moderateUser = async (userId, payload, successMessage) => {
    try {
      setStatus({ type: '', message: '' });
      await updateAdminUser(userId, payload);
      await refreshUsers();
      setStatus({ type: 'success', message: successMessage });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Không thể cập nhật trạng thái tài khoản.' });
    }
  };

  return (
    <PageLayout
      breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: 'Admin', to: '/admin' }, { label: 'Quản lý tài khoản Alumni' }]}
      eyebrow="Admin"
      title="Quản lý tài khoản Alumni"
      description="Duyệt hồ sơ pending, kích hoạt hoặc tạm ngưng tài khoản và chuyển vai trò quản trị khi cần."
      aside={
        <div className="rounded-[28px] bg-brand-sand px-6 py-6">
          <h2 className="text-lg font-semibold text-brand-ink">Bộ lọc moderation</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">Tìm theo email, họ tên, CCCD hoặc MSSV; lọc nhanh nhóm tài khoản chờ xác thực.</p>
        </div>
      }
    >
      <section className="space-y-6">
        <div className="panel grid gap-4 px-6 py-6 md:grid-cols-[1fr_220px_auto] md:items-end">
          <label>
            <span className="input-label">Tìm kiếm</span>
            <input
              className="input-field"
              value={filters.search}
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
              placeholder="email, họ tên, CCCD, MSSV"
            />
          </label>
          <label>
            <span className="input-label">Trạng thái tài khoản</span>
            <select
              className="input-field"
              value={filters.accountStatus}
              onChange={(event) => setFilters((current) => ({ ...current, accountStatus: event.target.value }))}
            >
              <option value="ALL">Tất cả</option>
              <option value="PENDING">Pending</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </label>
          <button type="button" className="btn-primary" onClick={() => refreshUsers()}>
            Áp dụng bộ lọc
          </button>
        </div>

        {status.message ? (
          <p className={`text-sm ${status.type === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>
            {status.message}
          </p>
        ) : null}

        {items.length ? (
          <div className="space-y-4">
            {items.map((item) => (
              <article key={item.id} className="panel px-6 py-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-semibold text-brand-ink">{item.full_name || item.email}</h2>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {item.account_status}
                      </span>
                      <span className="rounded-full bg-brand-sand px-3 py-1 text-xs font-semibold text-brand">
                        {item.role}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                      <p>Email: {item.email}</p>
                      <p>CCCD: {item.identity_id || 'Chưa có'}</p>
                      <p>MSSV: {item.student_id || 'Chưa có'}</p>
                      <p>Ngày tham gia: {new Date(item.date_joined).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {item.account_status !== 'ACTIVE' ? (
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => moderateUser(item.id, { account_status: 'ACTIVE' }, 'Đã kích hoạt tài khoản.')}
                      >
                        Kích hoạt
                      </button>
                    ) : null}
                    {item.account_status !== 'INACTIVE' ? (
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => moderateUser(item.id, { account_status: 'INACTIVE', is_active: false }, 'Đã tạm ngưng tài khoản.')}
                      >
                        Tạm ngưng
                      </button>
                    ) : null}
                    {item.role !== 'ADMIN' ? (
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => moderateUser(item.id, { role: 'ADMIN', account_status: 'ACTIVE', is_active: true }, 'Đã cập nhật tài khoản thành Admin.')}
                      >
                        Cấp quyền Admin
                      </button>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Không có tài khoản phù hợp"
            message="Thử đổi từ khóa hoặc bộ lọc trạng thái để xem thêm hồ sơ alumni."
          />
        )}
      </section>
    </PageLayout>
  );
}

export default AdminUsersPage;
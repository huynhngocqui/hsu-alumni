import { useCallback, useEffect, useMemo, useState } from 'react';
import { deleteAdminAlumniPost, listAdminAlumniPosts } from '../../api/alumni';
import AdminAlumniForm from '../../components/alumni/AdminAlumniForm';
import AdminAlumniTable from '../../components/alumni/AdminAlumniTable';
import ConfirmModal from '../../components/common/ConfirmModal';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import PageLayout from '../../components/common/PageLayout';

function AdminAlumniPostsPage() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const refreshItems = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const payload = await listAdminAlumniPosts();
      const nextItems = Array.isArray(payload) ? payload : payload?.results ?? [];
      setItems(nextItems);
      return nextItems;
    } catch (nextError) {
      setItems([]);
      setError(nextError.message || 'Không thể tải danh sách alumni.');
      throw nextError;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshItems().catch(() => {});
  }, [refreshItems]);

  const summary = useMemo(() => ({
    total: items.length,
    published: items.filter((item) => item.status === 'PUBLISHED').length,
    draft: items.filter((item) => item.status === 'DRAFT').length,
  }), [items]);

  const handleSaved = async (savedItem, actionType) => {
    const nextItems = await refreshItems().catch(() => []);
    const resolvedItem = nextItems.find((item) => item.id === savedItem?.id) || savedItem || null;

    setSelectedItem(resolvedItem);
    setStatus({
      type: 'success',
      message: actionType === 'created' ? 'Đã tạo bài viết alumni mới.' : 'Đã cập nhật bài viết alumni.',
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setIsDeleting(true);
      setStatus({ type: '', message: '' });
      await deleteAdminAlumniPost(deleteTarget.id);
      await refreshItems().catch(() => []);

      if (selectedItem?.id === deleteTarget.id) {
        setSelectedItem(null);
      }

      setStatus({ type: 'success', message: 'Đã xóa bài viết alumni.' });
      setDeleteTarget(null);
    } catch (nextError) {
      setStatus({ type: 'error', message: nextError.message || 'Không thể xóa bài viết alumni.' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <PageLayout
        breadcrumbItems={[{ label: 'Trang chủ', to: '/' }, { label: 'Admin', to: '/admin' }, { label: 'Cộng đồng Alumni' }]}
        eyebrow="Admin"
        title="Quản lý Cộng đồng Alumni"
        description="Thêm, chỉnh sửa, xóa hồ sơ alumni; upload ảnh đại diện và hình nội dung; quản trị trạng thái publish hoặc draft ngay trong một màn hình."
        actions={
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setSelectedItem(null);
              setStatus({ type: '', message: '' });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Thêm bài alumni mới
          </button>
        }
        aside={
          <div className="rounded-[28px] bg-brand-sand px-6 py-6">
            <h2 className="text-lg font-semibold text-brand-ink">Tóm tắt nhanh</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[22px] bg-white px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Tổng số</p>
                <p className="mt-2 text-2xl font-bold text-brand-ink">{summary.total}</p>
              </div>
              <div className="rounded-[22px] bg-white px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Published</p>
                <p className="mt-2 text-2xl font-bold text-emerald-600">{summary.published}</p>
              </div>
              <div className="rounded-[22px] bg-white px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Draft</p>
                <p className="mt-2 text-2xl font-bold text-amber-600">{summary.draft}</p>
              </div>
            </div>
          </div>
        }
      >
        <section className="grid gap-6 xl:grid-cols-[minmax(0,0.98fr)_minmax(0,1.02fr)]">
          <AdminAlumniForm
            initial={selectedItem}
            onSaved={handleSaved}
            onCancel={() => setSelectedItem(null)}
          />

          <div className="space-y-4">
            {status.message ? (
              <p className={`text-sm ${status.type === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>
                {status.message}
              </p>
            ) : null}

            {error && !items.length ? (
              <ErrorState message={error} action={refreshItems} />
            ) : !items.length && loading ? (
              <LoadingState title="Đang tải danh sách alumni" />
            ) : items.length ? (
              <AdminAlumniTable
                items={items}
                loading={loading}
                onEdit={(item) => {
                  setSelectedItem(item);
                  setStatus({ type: '', message: '' });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onDelete={(item) => setDeleteTarget(item)}
              />
            ) : (
              <EmptyState
                title="Chưa có bài alumni nào"
                message="Tạo hồ sơ đầu tiên để trang `/cong-dong-alumni` bắt đầu có dữ liệu hiển thị."
              />
            )}
          </div>
        </section>
      </PageLayout>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Xóa bài viết alumni"
        message={deleteTarget ? `Bạn sắp xóa hồ sơ của ${deleteTarget.full_name}. Thao tác này không thể hoàn tác.` : ''}
        confirmLabel="Xóa bài viết"
        isConfirming={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}

export default AdminAlumniPostsPage;
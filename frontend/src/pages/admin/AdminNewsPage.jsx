import { useEffect, useMemo, useState } from 'react';
import {
  deleteAdminNewsPost,
  listAdminNewsCategories,
  listAdminNewsPosts,
} from '../../api/admin';
import AdminSearchFilter from '../../components/admin/AdminSearchFilter';
import DashboardStats from '../../components/admin/DashboardStats';
import NewsForm from '../../components/admin/NewsForm';
import NewsTable from '../../components/admin/NewsTable';
import ConfirmModal from '../../components/common/ConfirmModal';
import ErrorState from '../../components/common/ErrorState';
import LoadingState from '../../components/common/LoadingState';
import ToastStack from '../../components/common/ToastStack';
import { useToastQueue } from '../../hooks/useToastQueue';

function AdminNewsPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { items: toasts, pushToast, removeToast } = useToastQueue();

  const refreshItems = async () => {
    setLoading(true);
    setError('');

    try {
      const [nextItems, nextCategories] = await Promise.all([
        listAdminNewsPosts({ search, status, category }),
        listAdminNewsCategories(),
      ]);

      setItems(Array.isArray(nextItems) ? nextItems : nextItems?.results || []);
      setCategories(Array.isArray(nextCategories) ? nextCategories : []);
    } catch (nextError) {
      setItems([]);
      setError(nextError.message || 'Không thể tải danh sách tin tức.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshItems();
  }, [category, search, status]);

  const stats = useMemo(() => ([
    { label: 'Tổng bài viết', value: items.length, description: 'Bao gồm mọi trạng thái trong bộ lọc hiện tại.' },
    { label: 'Đã publish', value: items.filter((item) => item.status === 'PUBLISHED').length, meta: 'LIVE' },
    { label: 'Bản nháp', value: items.filter((item) => item.status === 'DRAFT').length, meta: 'DRAFT' },
    { label: 'Bài viết nổi bật', value: items.filter((item) => item.is_featured).length, meta: 'FEATURED' },
  ]), [items]);

  return (
    <>
      <ToastStack items={toasts} onDismiss={removeToast} />
      <div className="space-y-8">
        <DashboardStats items={stats} />

        <AdminSearchFilter
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Tìm tiêu đề, mô tả hoặc nội dung bài viết"
          filters={[
            {
              name: 'status',
              label: 'Trạng thái',
              value: status,
              onChange: setStatus,
              options: [
                { value: '', label: 'Tất cả' },
                { value: 'PUBLISHED', label: 'PUBLISHED' },
                { value: 'DRAFT', label: 'DRAFT' },
                { value: 'ARCHIVED', label: 'ARCHIVED' },
              ],
            },
            {
              name: 'category',
              label: 'Danh mục',
              value: category,
              onChange: setCategory,
              options: [{ value: '', label: 'Tất cả danh mục' }, ...categories.map((item) => ({ value: item.slug, label: item.name }))],
            },
          ]}
          actionLabel="Tạo bài viết mới"
          onAction={() => setSelectedItem(null)}
        />

        {error && !items.length && !loading ? <ErrorState message={error} action={refreshItems} /> : null}
        {loading && !items.length ? <LoadingState title="Đang tải danh sách tin tức" /> : null}

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.06fr)_minmax(420px,0.94fr)]">
          <div className="space-y-4">
            <NewsTable
              items={items}
              onEdit={(item) => {
                setSelectedItem(item);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onDelete={setDeleteTarget}
            />
          </div>

          <NewsForm
            initial={selectedItem}
            categories={categories}
            onCancel={() => setSelectedItem(null)}
            onSaved={async (_savedItem, actionType) => {
              await refreshItems();
              pushToast({
                type: 'success',
                title: actionType === 'created' ? 'Đã tạo mới' : 'Đã cập nhật',
                message: actionType === 'created' ? 'Bài viết tin tức đã được tạo thành công.' : 'Bài viết tin tức đã được cập nhật.',
              });
            }}
          />
        </section>
      </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Xóa bài viết tin tức"
        message={deleteTarget ? `Bạn sắp xóa bài viết “${deleteTarget.title}”. Thao tác này không thể hoàn tác.` : ''}
        confirmLabel="Xóa bài viết"
        isConfirming={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) {
            return;
          }

          try {
            setIsDeleting(true);
            await deleteAdminNewsPost(deleteTarget.id);
            await refreshItems();
            setSelectedItem((current) => current?.id === deleteTarget.id ? null : current);
            pushToast({ type: 'success', title: 'Đã xóa', message: 'Bài viết tin tức đã được xóa.' });
            setDeleteTarget(null);
          } catch (nextError) {
            pushToast({ type: 'error', title: 'Xóa thất bại', message: nextError.message || 'Không thể xóa bài viết tin tức.' });
          } finally {
            setIsDeleting(false);
          }
        }}
      />
    </>
  );
}

export default AdminNewsPage;
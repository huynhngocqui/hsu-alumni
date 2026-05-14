import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  createAdminNewsCategory,
  deleteAdminNewsCategory,
  listAdminNewsCategories,
  updateAdminNewsCategory,
} from '../../api/admin';
import AdminDataTable from '../../components/admin/AdminDataTable';
import DashboardStats from '../../components/admin/DashboardStats';
import ConfirmModal from '../../components/common/ConfirmModal';
import EmptyState from '../../components/common/EmptyState';
import ToastStack from '../../components/common/ToastStack';
import { EditIcon, TrashIcon } from '../../components/common/icons';
import { useToastQueue } from '../../hooks/useToastQueue';

function buildDefaultValues(item) {
  return {
    name: item?.name || '',
    slug: item?.slug || '',
    description: item?.description || '',
    sort_order: item?.sort_order ?? 0,
    status: item?.status || 'PUBLISHED',
  };
}

function AdminNewsCategoriesPage() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { items: toasts, pushToast, removeToast } = useToastQueue();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({ defaultValues: buildDefaultValues(null) });

  const refreshItems = async () => {
    const payload = await listAdminNewsCategories();
    setItems(Array.isArray(payload) ? payload : []);
  };

  useEffect(() => {
    refreshItems().catch(() => setItems([]));
  }, []);

  useEffect(() => {
    reset(buildDefaultValues(selectedItem));
  }, [reset, selectedItem]);

  const stats = useMemo(() => ([
    { label: 'Tổng danh mục', value: items.length, description: 'Nhóm phân loại cho route `/tin-tuc`.' },
    { label: 'Đang publish', value: items.filter((item) => item.status === 'PUBLISHED').length, meta: 'LIVE' },
    { label: 'Bản nháp', value: items.filter((item) => item.status === 'DRAFT').length, meta: 'DRAFT' },
  ]), [items]);

  const columns = [
    {
      key: 'name',
      label: 'Danh mục',
      render: (row) => (
        <div>
          <p className="font-semibold text-brand-ink">{row.name}</p>
          <p className="mt-1 text-xs text-slate-400">/{row.slug}</p>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Mô tả',
    },
    {
      key: 'status',
      label: 'Trạng thái',
      type: 'status',
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <button type="button" className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700" onClick={() => setSelectedItem(row)}>
            <EditIcon /> Chỉnh sửa
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-600" onClick={() => setDeleteTarget(row)}>
            <TrashIcon /> Xóa
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <ToastStack items={toasts} onDismiss={removeToast} />
      <div className="space-y-8">
        <DashboardStats items={stats} />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <AdminDataTable columns={columns} rows={items} emptyState={<EmptyState title="Chưa có danh mục" message="Tạo danh mục tin tức đầu tiên để nhóm nội dung mới có cấu trúc rõ ràng." />} />

          <form
            className="space-y-5 rounded-[30px] border border-slate-200 bg-white px-6 py-6 shadow-[0_18px_36px_rgba(15,23,42,0.06)]"
            onSubmit={handleSubmit(async (values) => {
              try {
                const payload = { ...values, sort_order: Number(values.sort_order || 0) };
                if (selectedItem) {
                  await updateAdminNewsCategory(selectedItem.id, payload);
                  pushToast({ type: 'success', title: 'Đã cập nhật', message: 'Danh mục tin tức đã được cập nhật.' });
                } else {
                  await createAdminNewsCategory(payload);
                  pushToast({ type: 'success', title: 'Đã tạo mới', message: 'Danh mục tin tức đã được tạo.' });
                }

                setSelectedItem(null);
                reset(buildDefaultValues(null));
                await refreshItems();
              } catch (error) {
                pushToast({ type: 'error', title: 'Không thể lưu', message: error.message || 'Không thể lưu danh mục tin tức.' });
              }
            })}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-red">Danh mục</p>
                <h2 className="mt-2 text-2xl font-semibold text-brand-ink">{selectedItem ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}</h2>
              </div>
              {selectedItem ? <button type="button" className="btn-secondary" onClick={() => setSelectedItem(null)}>Tạo mới</button> : null}
            </div>

            <label className="block">
              <span className="input-label">Tên danh mục</span>
              <input className="input-field" {...register('name', { required: true })} />
            </label>
            <label className="block">
              <span className="input-label">Slug</span>
              <input className="input-field" {...register('slug')} placeholder="Có thể để trống để backend tự sinh" />
            </label>
            <label className="block">
              <span className="input-label">Mô tả</span>
              <textarea className="input-field min-h-28" {...register('description')} />
            </label>
            <label className="block">
              <span className="input-label">Sort order</span>
              <input className="input-field" type="number" {...register('sort_order')} />
            </label>
            <label className="block">
              <span className="input-label">Trạng thái</span>
              <select className="input-field" {...register('status')}>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="DRAFT">DRAFT</option>
              </select>
            </label>

            <div className="flex flex-wrap gap-3">
              <button type="submit" className="btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Đang lưu...' : selectedItem ? 'Cập nhật danh mục' : 'Tạo danh mục'}</button>
              <button type="button" className="btn-secondary" onClick={() => {
                setSelectedItem(null);
                reset(buildDefaultValues(null));
              }}>
                Làm mới
              </button>
            </div>
          </form>
        </section>
      </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Xóa danh mục"
        message={deleteTarget ? `Bạn sắp xóa danh mục “${deleteTarget.name}”. Hãy chắc chắn rằng không còn bài viết đang phụ thuộc vào danh mục này.` : ''}
        confirmLabel="Xóa danh mục"
        isConfirming={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) {
            return;
          }

          try {
            setIsDeleting(true);
            await deleteAdminNewsCategory(deleteTarget.id);
            await refreshItems();
            setSelectedItem((current) => current?.id === deleteTarget.id ? null : current);
            pushToast({ type: 'success', title: 'Đã xóa', message: 'Danh mục tin tức đã được xóa.' });
            setDeleteTarget(null);
          } catch (error) {
            pushToast({ type: 'error', title: 'Xóa thất bại', message: error.message || 'Không thể xóa danh mục tin tức.' });
          } finally {
            setIsDeleting(false);
          }
        }}
      />
    </>
  );
}

export default AdminNewsCategoriesPage;